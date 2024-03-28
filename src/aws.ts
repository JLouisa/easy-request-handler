import { env } from "./env";
import path from "path";
import { getOutputDir } from "./utils";
import { mkdir, writeFile } from "fs/promises";
import { Readable } from "stream";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

// Check if the upload service is AWS
const uploadService = env.UPLOAD_SERVICE === "aws" ? true : false;

// Initialize S3 client
const s3 = new S3Client({
  region: uploadService ? env.AWS_REGION : "auto",
  endpoint: uploadService ? undefined : env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: uploadService
      ? env.AWS_ACCESS_KEY_ID
      : env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: uploadService
      ? env.AWS_SECRET_ACCESS_KEY
      : env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

// Convert stream to string
const streamToString = (stream: Readable) =>
  new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });

export const downloadS3Files = async (id: string, filePath: string) => {
  console.log("Downloading website from S3");

  const prefix = `dist/${id}`; // Adjust the prefix dynamically

  // Configure S3 parameters
  const params = {
    Bucket: env.BUCKET_NAME,
    Key: `dist/${id}${filePath}`,
    // Prefix: prefix,
  };

  console.log("Key: " + `dist/${id}${filePath}`);

  // Download each file asynchronously
  const commandGet = new GetObjectCommand(params);

  try {
    const { Body } = await s3.send(commandGet);
    return await streamToString(Body as Readable);
  } catch (error) {
    console.error("Error occurred while downloading:", error);
  }
};
