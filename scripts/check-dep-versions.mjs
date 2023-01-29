#!/usr/bin/env node
/* eslint-disable no-console */

import fs from "node:fs";
import { globby } from "globby";
import prettier from "prettier";

const packageJsons = await loadPackageJsons();

const dependencies = {};
for (const packageJson of packageJsons) {
  gatherDependencies(packageJson, "devDependencies", dependencies);
  gatherDependencies(packageJson, "dependencies", dependencies);
}

const differentDependencies = [];
for (const [name, sources] of Object.entries(dependencies)) {
  const versions = new Set(sources.map((source) => source.version));
  if (versions.size > 1) {
    differentDependencies.push({ name, sources });
  }
}

if (differentDependencies.length > 0) {
  console.error("Found different dependencies in workspaces");
  const json = JSON.stringify(differentDependencies, 0, 2);
  console.error(prettier.format(json, { parser: "json" }));
  process.exit(1);
}

console.log("\nAll good! All dependencies have the same version.");

async function loadPackageJsons() {
  const files = await globby("**/package.json", { gitignore: true });
  return files.map((file) => ({ file, content: loadPackageJson(file) }));
}

function loadPackageJson(packageJsonFile) {
  console.log("Loading " + packageJsonFile);
  const content = fs.readFileSync(packageJsonFile, "utf-8");
  return JSON.parse(content);
}

function gatherDependencies({ file, content }, type, targetObject) {
  for (const [dep, version] of Object.entries(content[type] ?? {})) {
    if (targetObject[dep] == null) {
      targetObject[dep] = [];
    }
    targetObject[dep].push({
      version,
      file,
      type,
    });
  }
}
