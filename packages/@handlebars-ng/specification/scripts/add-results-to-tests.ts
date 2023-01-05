import { specFilesRelativeToSpecDir } from "@/utils/testcases";
import { addResultToFile } from "./lib/addResultToFile";

for (const file of await specFilesRelativeToSpecDir()) {
  await addResultToFile(file).catch((error) => {
    console.log("Failed to update " + file + ": " + error["message"]);
  });
}
