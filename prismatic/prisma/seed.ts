import path from "path";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import matter from "gray-matter";
import yaml from "js-yaml";

type yamlImportFile = {
  slug: string;
  poster: string;
  posterPortrait: string;
  supportsLandscape: boolean;
  title: string;
  media: string[];
};

const inventory = path.join(
  __dirname,
  process.env.INVENTORY_PATH || "../../../../inventory"
);
console.log("inventory: ", inventory);

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  const filenames: string[] = fs.readdirSync(inventory);
  console.log("filenames: ", filenames);

  const markdownSet = new Set<string>();

  const yamlSet = new Set<string>();

  function utf8_to_b64(str: string) {
    return decodeURIComponent(escape(Buffer.from(str).toString("base64")));
    //   return window.btoa(unescape(encodeURIComponent(str)));
  }

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

  // console.log("\nCurrent directory filenames:");
  filenames.forEach((file) => {
    file.endsWith(".md") && markdownSet.add(file);
    file.endsWith(".yml") && yamlSet.add(file);
    file.endsWith(".yaml") && yamlSet.add(file);
  });

  markdownSet.forEach(async (markdown) => {
    const fileText = await fs.readFileSync(`${inventory}/${markdown}`, "utf8");
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
    const fileText = await fs.readFileSync(`${inventory}/${yml}`, "utf8");
    try {
      const yamlDoc = yaml.load(fileText) as yamlImportFile;
      const { poster } = yamlDoc;
      const posterFile = `${inventory}/${poster}`;

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

          const imageFile = `${inventory}/${filename}.jpg`;

          // If it's a video...
          if (extension === "mp4") {
            const videoFile = `${inventory}/${filename}.mp4`;

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
  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
