import { HandlebarsTest } from "types/tests";
import prettier from "prettier";
import fs from "node:fs/promises";

export async function writeTestcase(
  file: string,
  testcase: HandlebarsTest
): Promise<void> {
  const json = JSON.stringify(testcase);
  const formatted = prettier.format(json, { parser: "json" });
  if ((await readFileOrNull(file)) !== formatted) {
    console.log("Updating " + file);
    await fs.writeFile(file, formatted);
  }
}

async function readFileOrNull(file: string): Promise<string | null> {
  try {
    return await fs.readFile(file, "utf-8");
  } catch (error) {
    if (hasProperty(error, "code") && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

function hasProperty<T extends string>(
  object: unknown,
  prop: T
): object is { [prop in T]: string } {
  return prop in (object as { [prop in T]: string });
}
