import path from "node:path";

const specDir = path.resolve(__dirname, "..", "..", "src", "spec");

export function resolveSpecFile(fileRelativeToSpecDir: string): string {
  return path.resolve(specDir, fileRelativeToSpecDir);
}

export function relativeToSpec(file: string): string {
  return path.relative(specDir, path.resolve(file));
}
