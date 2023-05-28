import { EditorLanguage } from "./CodeMirror.types";

export function codeMirrorMode(language: EditorLanguage | undefined): {
  name: string;
  html?: boolean;
} {
  switch (language) {
    case "handlebars":
      return { name: "handlebars" };
    case "json":
    case "javascript":
      return { name: "javascript" };
    case "html":
      return {
        name: "xml",
        html: true,
      };
    default:
      return { name: "text" };
  }
}
