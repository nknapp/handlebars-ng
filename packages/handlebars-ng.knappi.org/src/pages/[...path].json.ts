import prettier from "prettier";
import type { APIRoute } from "astro";

const imports = await import.meta.glob("./**/*.json");
const jsonFiles = keysToPathParams(imports);
jsonFiles["spec/tests/all-tests"] = () =>
  import("@handlebars-ng/specification/tests");

export function getStaticPaths() {
  return Object.keys(jsonFiles).map((path) => ({
    params: {
      path,
    },
  }));
}

export const get: APIRoute = async ({ params }) => {
  const content = await getContent(params.path ?? "");
  if (content == null) {
    return new Response("JSON file not found " + params.path, {
      status: 404,
      statusText: "Not found",
    });
  }

  const json = JSON.stringify(content);
  return {
    body: prettier.format(json, { parser: "json" }),
    encoding: "utf-8",
  };
};

async function getContent(path: string): Promise<object | null> {
  const module = jsonFiles[path];
  if (module == null) {
    return null;
  }
  const moduleExports = (await module()) as { default: object };
  return moduleExports.default;
}

function keysToPathParams(
  imports: Record<string, () => Promise<unknown>>
): Record<string, () => Promise<unknown>> {
  const entries = Object.entries(imports);
  const resultEntries = entries.map(([key, value]) => {
    const newKey = stripDotSlashAndExtension(key);
    return [newKey, value];
  });
  return Object.fromEntries(resultEntries);
}

function stripDotSlashAndExtension(path: string) {
  let result = path.replace(/^\.\//, "");
  result = result.replace(/.json$/, "");
  return result;
}
