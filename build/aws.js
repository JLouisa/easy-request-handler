"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadS3Files = void 0;
const env_1 = require("./env");
const client_s3_1 = require("@aws-sdk/client-s3");
// Check if the upload service is AWS
const uploadService = env_1.env.UPLOAD_SERVICE === "aws" ? true : false;
// Initialize S3 client
const s3 = new client_s3_1.S3Client({
    region: uploadService ? env_1.env.AWS_REGION : "auto",
    endpoint: uploadService ? undefined : env_1.env.CLOUDFLARE_R2_ENDPOINT,
    credentials: {
        accessKeyId: uploadService
            ? env_1.env.AWS_ACCESS_KEY_ID
            : env_1.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: uploadService
            ? env_1.env.AWS_SECRET_ACCESS_KEY
            : env_1.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
});
// Convert stream to string
const streamToString = (stream) => new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
});
const downloadS3Files = (id, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Downloading website from S3");
    const prefix = `dist/${id}`; // Adjust the prefix dynamically
    console.log("Prefix:", prefix);
    // Configure S3 parameters
    const params = {
        Bucket: env_1.env.BUCKET_NAME,
        Key: `dist/${id}${filePath}`,
        Prefix: prefix,
    };
    // Download each file asynchronously
    const commandGet = new client_s3_1.GetObjectCommand(params);
    try {
        return yield s3.send(commandGet);
    }
    catch (error) {
        console.error("Error occurred while downloading:", error);
    }
});
exports.downloadS3Files = downloadS3Files;
