import path from "node:path";
import { addResultToFile } from "./lib/addResultToFile";
import { handlebarsSpec } from "src";

export const specDir = path.resolve(__dirname, "..", "src", "spec");

for (const file of Object.keys(handlebarsSpec)) {
  const absoluteFile = path.resolve(specDir, file);
  await addResultToFile(absoluteFile).catch((error) => {
    console.log("Failed to update " + file + ": " + error, error.stack);
  });
}
