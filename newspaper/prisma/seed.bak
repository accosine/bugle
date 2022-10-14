import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import { Client } from "minio";
import matter from "gray-matter";

const prisma = new PrismaClient();

const filenames: string[] = fs.readdirSync("./inventory");

const videoSet = new Set<string>();

const imgSet = new Set<string>();

const markdownSet = new Set<string>();

const minioClient = new Client({
  endPoint: "minio",
  port: 9000,
  useSSL: false,
  accessKey: "minio",
  secretKey: "minio123",
});

const S3_VIDEO_BUCKET = process.env.NEWSPAPER_VIDEODIR
  ? process.env.NEWSPAPER_VIDEODIR
  : "video";
const S3_IMAGE_BUCKET = process.env.NEWSPAPER_IMAGEDIR
  ? process.env.NEWSPAPER_IMAGEDIR
  : "image";

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

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function utf8_to_b64(str: string) {
  return decodeURIComponent(escape(Buffer.from(str).toString("base64")));
  //   return window.btoa(unescape(encodeURIComponent(str)));
}

// function b64_to_utf8(str: string) {
//   console.log(Buffer.from(b64Encoded, "base64").toString());
//   return decodeURIComponent(escape(window.atob(str)));
// }

async function main() {
  console.log("\nCurrent directory filenames:");
  filenames.forEach((file) => {
    file.endsWith(".mp4") && videoSet.add(file);
    file.endsWith(".jpg") && imgSet.add(file);
    file.endsWith(".md") && markdownSet.add(file);
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

  videoSet.forEach(async (video) => {
    const [filename] = video.split(".");
    const imgExt = ".jpg";
    if (imgSet.has(filename + imgExt)) {
      await prisma.ampMediaData.create({
        data: {
          type: "video",
          autoplay: true,
          loop: true,
          src: `${filename}.mp4`,
          width: 626,
          height: 1234,
          layout: "fill",
          poster: `${filename}.jpg`,
          ampStoryGridLayer: {
            create: { template: "fill", ampStoryPage: { create: {} } },
          },
        },
      });
    } else {
      // TODO: save to prisma as image
    }
    var videoFile = `./inventory/${filename}.mp4`;
    var imageFile = `./inventory/${filename}.jpg`;

    console.log('Bucket created successfully in "us-east-1".');

    var metaData = {
      "Content-Type": "application/octet-stream",
      "X-Amz-Meta-Testing": 1234,
      example: 5678,
    };
    // Using fPutObject API upload your file to the bucket
    minioClient.fPutObject(
      S3_VIDEO_BUCKET,
      `${filename}.mp4`,
      videoFile,
      metaData,
      function (err: any) {
        if (err) return console.log(err);
        console.log("Video file uploaded successfully.");
      }
    );
    minioClient.fPutObject(
      S3_IMAGE_BUCKET,
      `${filename}.jpg`,
      imageFile,
      metaData,
      function (err: any) {
        if (err) return console.log(err);
        console.log("Image file uploaded successfully.");
      }
    );
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

  // TODO: 👇 Make generation of example stories optional via argument flag
  // I got five on it
  const five = Array.from(Array(5).keys());
  // Also, I got three on it
  const three = Array.from(Array(10).keys());

  // Generate three stories with random pages
  three.map(async (num) => {
    const allPages = await prisma.ampStoryPageData.findMany();

    const randomPages = five.map(() => {
      const rndInt = randomIntFromInterval(0, allPages.length - 1);
      const page = allPages[rndInt];
      return { id: page.id };
    });

    await prisma.ampStoryData.create({
      data: {
        slugOriginal: `test-${num}`,
        slugBase64: utf8_to_b64(`test-${num}`),
        liveStory: false,
        liveStoryDisabled: true,
        poster: `poster ${num}`,
        posterPortraitSrc: `portrait poster ${num}`,
        supportsLandscape: false,
        title: `my ${num} title`,
        pages: { connect: randomPages },
      },
    });
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
