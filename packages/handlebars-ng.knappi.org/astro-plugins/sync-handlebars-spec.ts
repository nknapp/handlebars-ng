import { AstroIntegration } from "astro";

import path from "path";
import { SyncFile, TITLE_NONE } from "./lib/SyncFile";
import { SyncDirs } from "./lib/SyncDirs";

const specSourceDir = path.resolve("../@handlebars-ng/specification/src/spec");
const specTargetDir = path.resolve("src/pages/spec");

export function syncHandlebarsSpec(): AstroIntegration {
  return {
    name: "handlebars-spec",
    hooks: {
      "astro:config:setup": async ({ isRestart, command }) => {
        if (isRestart) return;

        if (command === "dev" || command === "build") {
          const syncDirs = new SyncDirs(
            specSourceDir,
            specTargetDir,
            applyTransformations
          );
          await syncDirs.syncAllFilesFromSpec();

          if (command === "dev") {
            syncDirs.watch();
          }
        }
      },
    },
  };
}

async function applyTransformations(file: SyncFile): Promise<void> {
  switch (file.originalExt) {
    case ".md":
      file.updateExtension(".mdx");
      file.addFrontMatter();
      break;
    case ".ts":
      file.updateExtension(".mdx");
      file.wrapContentInFences("typescript");
      file.addFrontMatter(TITLE_NONE);
      break;
    case ".json":
      break;
    case ".txt":
      break;
    case ".grammar":
      break;
    default:
      throw new Error(
        "Unknown file type for transformation: " + file.relativePath
      );
  }
}
