import express, { Request, Response } from "express";
import path from "path";
import logger from "morgan";
import { env } from "./env";

import { createClient } from "redis";
import { downloadS3Files } from "./aws";

const redis = createClient().on("error", (err) =>
  console.log("Redis Client Error", err)
);
redis.connect();

// Create Express server.
const app = express();

// Middleware
app.use(logger("dev"));

// Routes
app.get("/*", async (req: Request, res: Response) => {
  // Get the subdomain from the hostname
  const host = req.hostname;

  // For testing purposes, hardcode the ID
  const theID = "j3uprnwj";

  // Get the ID from the subdomain
  // const theID = host.split(".")[0];

  console.log("host", host);
  console.log("theID", theID);

  // Get the file path
  const filePath = req.path;
  console.log("filePath", filePath);

  // Download the file from S3
  const content = await downloadS3Files(theID, filePath);

  // Set the content type
  const type = filePath.endsWith(".html")
    ? "text/html"
    : filePath.endsWith(".css")
    ? "text/css"
    : "application/javascript";
  res.set("Content-Type", type);

  // Send the content
  res.send(content);
});

// Start Express server.
app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});
