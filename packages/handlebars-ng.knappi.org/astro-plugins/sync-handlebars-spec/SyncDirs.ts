import { isGitIgnoredSync, globby } from "globby";
import chokidar from "chokidar";
import fs from "fs/promises";
import path from "path";
import mkdirp from "make-dir";
import { SyncFile as SyncFile } from "./SyncFile";

type Transform = (file: SyncFile) => Promise<void>;

export class SyncDirs {
  private gitIgnoredInTargetDir: (file: string) => boolean;
  private sourceDir: string;
  private targetDir: string;
  private applyTransformations: Transform;
  private linkedFiles = new Map<string, string>();

  constructor(
    sourceDir: string,
    targetDir: string,
    applyTransformations: Transform
  ) {
    this.sourceDir = sourceDir;
    this.targetDir = targetDir;
    this.gitIgnoredInTargetDir = isGitIgnoredSync({ cwd: targetDir });
    this.applyTransformations = applyTransformations;
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
    const file = await this.loadFile(relativePath);
    if (file == null) {
      await this.removeCorrespondingTargetFile(source);
    } else {
      await this.applyTransformations(file);
      const target = await this.saveFile(file);
      this.linkedFiles.set(source, target);
    }
  }

  private async loadFile(relativePath: string): Promise<SyncFile | null> {
    try {
      const source = path.join(this.sourceDir, relativePath);
      const contents = await fs.readFile(source, "utf-8");
      return new SyncFile(relativePath, contents);
    } catch (error) {
      if (error.code === "ENOENT") {
        return null;
      } else {
        throw error;
      }
    }
  }

  private async removeCorrespondingTargetFile(source: string) {
    const targetFile = this.linkedFiles.get(source);
    if (targetFile != null) {
      await fs.unlink(targetFile);
    }
  }

  private async saveFile(file: SyncFile): Promise<string> {
    const target = path.join(this.targetDir, file.relativePath);
    await mkdirp(path.dirname(target));
    await fs.writeFile(target, file.contents);
    return target;
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
