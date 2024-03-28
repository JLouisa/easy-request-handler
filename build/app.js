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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./env");
const redis_1 = require("redis");
const aws_1 = require("./aws");
const redis = (0, redis_1.createClient)().on("error", (err) => console.log("Redis Client Error", err));
redis.connect();
// Create Express server.
const app = (0, express_1.default)();
// Middleware
app.use((0, morgan_1.default)("dev"));
// Routes
app.get("/*", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const content = yield (0, aws_1.downloadS3Files)(theID, filePath);
    // Set the content type
    const type = filePath.endsWith(".html")
        ? "text/html"
        : filePath.endsWith(".css")
            ? "text/css"
            : "application/javascript";
    res.setHeader("Content-Type", type);
    // Send the content
    res.send(content);
}));
// Start Express server.
app.listen(env_1.env.PORT, () => {
    console.log(`Server running on port ${env_1.env.PORT}`);
});
