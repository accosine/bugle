import fs from "fs";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import S3 from "aws-sdk/clients/s3.js";
import * as url from "url";
import mime from "mime-types";

dotenv.config();

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const accessKeyId = process.env.S3_ACCESS_KEY_ID || "minio";
const secretAccessKey = process.env.S3_ACCESS_KEY_SECRET || "minio123";
const endpoint = process.env.S3_ENDPOINT || "http://minio:9000";
const s3Type = process.env.S3_ACCOUNT_TYPE || "minio";
const s3VideoBucket = process.env.S3_VIDEO_BUCKET
  ? process.env.S3_VIDEO_BUCKET
  : "video";
const s3ImageBucket = process.env.S3_IMAGE_BUCKET
  ? process.env.S3_IMAGE_BUCKET
  : "image";
const s3BlobBucket = process.env.S3_BLOB_BUCKET
  ? process.env.S3_BLOB_BUCKET
  : "blob";
const s3ForbiddenExtension = process.env.S3_FORBIDDEN_EXTENSIONS
  ? process.env.S3_FORBIDDEN_EXTENSIONS.split(",")
  : [];
const inventory = process.env.INVENTORY_FOLDER
  ? `${process.env.INVENTORY_FOLDER}`
  : `${__dirname}../inventory`;
const filenames = fs.readdirSync(inventory);
const s3 = new S3({
  endpoint,
  accessKeyId,
  secretAccessKey,
  s3ForcePathStyle: true, // needed with minio?
  signatureVersion: "v4",
});

/**
 * Check if bucket exists
 * @param {string} bucket - Bucket name where the object is stored
 * @returns {boolean} - true if the bucket exists, otherwise false
 */
const bucketExists = async (bucket) =>
  await s3
    .headBucket({ Bucket: bucket })
    .promise()
    .catch((err) => {
      if (err.statusCode === 404) {
        return false;
      }
      throw err;
    });

/**
 * convert policy JSON into string and assign into params
 * @param {*} bucketname
 * @returns
 */
const bucketPolicy = (bucketname) => ({
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

/**
 * ...TODO
 * @param {*} bucket
 */
const bootstrapBucket = async (bucket) => {
  const bucketPolicyParams = {
    Bucket: bucket,
    Policy: JSON.stringify(bucketPolicy(bucket)),
  };

  if (!(await bucketExists(bucket))) {
    // call S3 to create the bucket
    console.log(`Bucket "${bucket}" does not exist. Will create now...`);

    const createBucket = await s3
      .createBucket({
        Bucket: bucket,
      })
      .promise()
      .catch((err) => {
        console.error("ARGH: ", err);
        return err;
      });
    console.log("Created bucket: ", createBucket);
  }

  if (s3Type === "minio") {
    // set the new policy on the selected bucket
    const putBucketPolicy = await s3
      .putBucketPolicy(bucketPolicyParams)
      .promise();
    console.log("Set bucket policy: ", bucketPolicyParams);
  }
};

/**
 *
 * @param {*} mime
 * @returns
 */
const determineBucket = (mime) => {
  if (mime.match(/^image/)) {
    return s3ImageBucket;
  }
  if (mime.match(/^video/)) {
    return s3VideoBucket;
  }
  return s3BlobBucket;
};

const main = async () => {
  // putObject operation.
  await bootstrapBucket(s3VideoBucket);
  await bootstrapBucket(s3ImageBucket);
  await bootstrapBucket(s3BlobBucket);

  for (const file of filenames) {
    // filenames.forEach(async (file) => {
    const filePath = `${inventory}/${file}`;
    const [, extension] = file.split(".");

    // Skip markdown and yaml files
    if (s3ForbiddenExtension.includes(extension)) {
      continue;
    }

    const blob = fs.readFileSync(filePath);
    const ContentType = mime.lookup(extension) || "application/octet-stream";
    const Bucket = determineBucket(ContentType);

    const params = {
      Bucket,
      Key: file,
      Body: blob,
      ContentType,
    };

    const putObject = await s3.putObject(params).promise();
    console.log(
      `Uploded object "${file}" with mimeType "${ContentType}" to bucket "${Bucket}": `,
      putObject
    );
    // });
  }
};

main();
