import { isGitIgnoredSync, globby } from "globby";
import chokidar from "chokidar";
import fs from "fs/promises";
import path from "path";
import mkdirp from "make-dir";

export interface SyncedFile {
  relativePath: string;
  contents: string;
}

type Transform = (file: SyncedFile) => Promise<SyncedFile>;

export class SyncDirs {
  private gitIgnoredInTargetDir: (file: string) => boolean;
  private sourceDir: string;
  private targetDir: string;
  private transform: Transform;
  private linkedFiles = new Map<string, string>();

  constructor(sourceDir: string, targetDir: string, transform: Transform) {
    this.sourceDir = sourceDir;
    this.targetDir = targetDir;
    this.gitIgnoredInTargetDir = isGitIgnoredSync({ cwd: targetDir });
    this.transform = transform;
  }

  async syncAllFilesFromSpec() {
    const sourceFiles = await globby("**/*", {
      cwd: this.sourceDir,
      gitignore: true,
      dot: true,
    });
    if (sourceFiles.length === 0) throw new Error("No spec files found");

    for (const file of sourceFiles) {
      await this.syncFileFromSpec(file);
    }

    await this.deleteSurplusTargetFiles();
  }

  watch(): void {
    const watcher = chokidar.watch(this.sourceDir, { cwd: this.sourceDir });
    watcher.on("add", (file) => this.syncFileFromSpec(file));
    watcher.on("unlink", (file) => this.syncFileFromSpec(file));
    watcher.on("change", (file) => this.syncFileFromSpec(file));
  }

  private async syncFileFromSpec(relativePath: string) {
    const source = path.join(this.sourceDir, relativePath);
    try {
      const contents = await fs.readFile(source, "utf-8");
      const transformed = await this.transform({
        relativePath,
        contents: contents,
      });
      const target = path.join(this.targetDir, transformed.relativePath);
      this.linkedFiles.set(source, target);

      await mkdirp(path.dirname(target));
      await fs.writeFile(target, transformed.contents);
    } catch (error) {
      if (error.code === "ENOENT") {
        const targetFile = this.linkedFiles.get(source);
        if (targetFile != null) {
          await fs.unlink(targetFile);
        }
      } else {
        throw error;
      }
    }
  }

  private async deleteSurplusTargetFiles() {
    const targetFiles = await globby("**/*", {
      cwd: this.targetDir,
      dot: true,
    });

    const copiedFiles = new Set(this.linkedFiles.values());

    for (const relativePath of targetFiles) {
      if (!this.gitIgnoredInTargetDir(relativePath)) continue;

      const absolutePath = path.join(this.targetDir, relativePath);
      if (copiedFiles.has(absolutePath)) {
        continue;
      }

      await fs.unlink(absolutePath);
    }
  }
}
