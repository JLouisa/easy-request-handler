import { exec } from "child_process";
import path from "path";
import fs from "fs";

export function getOutputDir(): string {
  // Get the current directory
  const currentFolder = __dirname;

  // Get the parent directory of the current directory
  const parentFolder = path.dirname(currentFolder).concat(`/output`);

  return parentFolder;
}
