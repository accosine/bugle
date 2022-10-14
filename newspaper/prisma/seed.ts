import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import { Client } from "minio";
import matter from "gray-matter";
import yaml from "js-yaml";

const S3_VIDEO_BUCKET = process.env.NEWSPAPER_VIDEODIR
  ? process.env.NEWSPAPER_VIDEODIR
  : "video";
const S3_IMAGE_BUCKET = process.env.NEWSPAPER_IMAGEDIR
  ? process.env.NEWSPAPER_IMAGEDIR
  : "image";

const prisma = new PrismaClient();

const filenames: string[] = fs.readdirSync("./inventory");

const markdownSet = new Set<string>();

const yamlSet = new Set<string>();

function utf8_to_b64(str: string) {
  return decodeURIComponent(escape(Buffer.from(str).toString("base64")));
  //   return window.btoa(unescape(encodeURIComponent(str)));
}

const makePolicy = (bucketname: string) =>
  JSON.stringify({
    Resource: [`arn:aws:s3:::${bucketname}/*`],
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "PublicRead",
        Effect: "Allow",
        Principal: "*",
        Action: ["s3:GetObject", "s3:GetObjectVersion"],
        Resource: [`arn:aws:s3:::${bucketname}/*`],
      },
    ],
  });

const metaData = {
  "Content-Type": "application/octet-stream",
  "X-Amz-Meta-Testing": 1234,
  example: 5678,
};

const putObjIntoMinio = (
  minioCl: any,
  bucket: string,
  filename: string,
  path: string,
  metadata: typeof metaData
) => {
  // Using fPutObject API upload your file to the bucket
  // console.log("filename: ", filename);
  minioCl.fPutObject(bucket, filename, path, metadata, function (err: any) {
    if (err) return console.log(err);
    console.log(`File ${filename} uploaded successfully.`);
  });
};

type ampMediaType = {
  filename: string;
  type: "image" | "video";
  width?: number;
  height?: number;
  layout?: "fill";
};

const createAmpMediaDataItem = ({
  filename,
  type,
  width = 626,
  height = 1234,
  layout = "fill",
}: ampMediaType) => ({
  type,
  autoplay: type === "image" ? false : true,
  loop: type === "image" ? false : true,
  src: `${filename}.${type === "image" ? "jpg" : "mp4"}`,
  width,
  height,
  layout,
  poster: `${filename}.jpg`,
});

async function main() {
  const minioClient = new Client({
    endPoint: "minio",
    port: 9000,
    useSSL: false,
    accessKey: "minio",
    secretKey: "minio123",
  });

  try {
    await minioClient.makeBucket(S3_VIDEO_BUCKET, "us-east-1");
    await minioClient.setBucketPolicy(
      S3_VIDEO_BUCKET,
      makePolicy(S3_VIDEO_BUCKET),
      function (err: any) {
        if (err) throw err;
        console.log("Video bucket policy set");
      }
    );
    await minioClient.makeBucket(S3_IMAGE_BUCKET, "us-east-1");
    await minioClient.setBucketPolicy(
      S3_IMAGE_BUCKET,
      makePolicy(S3_IMAGE_BUCKET),
      function (err: any) {
        if (err) throw err;
        console.log("Image bucket policy set");
      }
    );
  } catch (error) {
    console.error(error);
  }

  // console.log("\nCurrent directory filenames:");
  filenames.forEach((file) => {
    file.endsWith(".md") && markdownSet.add(file);
    file.endsWith(".yml") && yamlSet.add(file);
    file.endsWith(".yaml") && yamlSet.add(file);
  });

  markdownSet.forEach(async (markdown) => {
    const fileText = await fs.readFileSync(`./inventory/${markdown}`, "utf8");
    const page = matter(fileText);

    await prisma.pageData.create({
      data: {
        slugOriginal: page.data?.slug,
        slugBase64: utf8_to_b64(page.data?.slug),
        title: page.data?.title,
        content: page.content,
      },
    });
  });

  const processYamlFiles = async (yml: any) => {
    const fileText = await fs.readFileSync(`./inventory/${yml}`, "utf8");
    try {
      const yamlDoc = yaml.load(fileText);
      const { poster } = yamlDoc;
      const posterFile = `./inventory/${poster}`;

      // console.log("yamlDoc", yamlDoc);

      putObjIntoMinio(
        minioClient,
        S3_IMAGE_BUCKET,
        `${poster}`,
        posterFile,
        metaData
      );

      const yamlDocTransaction = await prisma.$transaction(
        yamlDoc.media.map((media: string) => {
          const [filename, extension] = media.split(".");

          // Register the the image version of the array item in the database,
          // we are gonna need it anyway
          const imgCreate = prisma.ampMediaData.create({
            data: {
              ...createAmpMediaDataItem({
                filename,
                type: "image",
              }),
              ampStoryGridLayer: {
                create: { template: "fill", ampStoryPage: { create: {} } },
              },
            },
          });

          const imageFile = `./inventory/${filename}.jpg`;

          // Also put the image into minio static storage
          putObjIntoMinio(
            minioClient,
            S3_IMAGE_BUCKET,
            `${filename}.jpg`,
            imageFile,
            metaData
          );

          // If it's a video...
          if (extension === "mp4") {
            const videoFile = `./inventory/${filename}.mp4`;

            // ... also put the video into minio static storage
            putObjIntoMinio(
              minioClient,
              S3_VIDEO_BUCKET,
              media,
              videoFile,
              metaData
            );

            //...and register it in the database as well
            return prisma.ampMediaData.create({
              data: {
                ...createAmpMediaDataItem({
                  filename,
                  type: "video",
                }),
                ampStoryGridLayer: {
                  create: { template: "fill", ampStoryPage: { create: {} } },
                },
              },
            });
          }

          // If it's not a video, just return the image
          return imgCreate;
        })
      );

      // console.log("yamlDocTransaction: ", yamlDocTransaction);
      // We just need the ids of the pages we created...
      const allStoryPages = yamlDocTransaction.map((page) => ({ id: page.id }));

      // ...and create a complete story with all pages in the database
      return await prisma.ampStoryData.create({
        data: {
          slugOriginal: yamlDoc.slug,
          slugBase64: utf8_to_b64(yamlDoc.slug),
          liveStory: false,
          liveStoryDisabled: true,
          poster: yamlDoc.poster,
          posterPortraitSrc: yamlDoc.posterPortrait,
          supportsLandscape: false,
          title: yamlDoc.title,
          pages: { connect: allStoryPages },
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  async function runConsecutively(files: any) {
    for (const file of files) {
      await processYamlFiles(file);
    }
  }

  runConsecutively(yamlSet);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {});
