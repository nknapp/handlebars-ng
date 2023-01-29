import prettier from "prettier";
import type { APIRoute } from "astro";
import { handlebarsSpec } from "@handlebars-ng/specification";
import { mapKeys } from "@/utils/mapKeys";
import { extractMiddle } from "@/utils/strings";

const imports = import.meta.glob("./**/*.json", {
  eager: true,
  import: "default",
});
imports["./spec/tests/all-tests.json"] = handlebarsSpec;

const jsonFiles = mapKeys(imports, (path) => {
  return extractMiddle(path, "./", ".json");
});

export function getStaticPaths() {
  return Object.keys(jsonFiles).map((path) => ({
    params: {
      path,
    },
  }));
}

export const get: APIRoute = async ({ params }) => {
  const path = params.paths;
  if (path == null || jsonFiles[path] == null) {
    return new Response("JSON file not found " + params.path, {
      status: 404,
      statusText: "Not found",
    });
  }

  const content = jsonFiles[params.path ?? ""];
  const json = JSON.stringify(content);
  return {
    body: prettier.format(json, { parser: "json" }),
    encoding: "utf-8",
  };
};
