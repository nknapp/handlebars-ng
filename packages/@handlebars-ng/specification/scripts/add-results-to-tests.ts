import { specDir } from "@/utils/testcases";
import path from "node:path";
import { specFilesRelativeToSpecDir } from "@/utils/testcases";
import { addResultToFile } from "./lib/addResultToFile";

for (const file of specFilesRelativeToSpecDir()) {
  const absoluteFile = path.resolve(specDir, file);
  await addResultToFile(absoluteFile).catch((error) => {
    console.log("Failed to update " + file + ": " + error, error.stack);
  });
}
