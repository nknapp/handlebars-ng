import {
  createHandlebarsParser,
  HandlebarsParser,
} from "./core/createHandlebarsParser";
import { ContentPlugin } from "./plugins";
import { MustachePlugin } from "./plugins/mustache/MustachePlugin";

export { ParseError } from "./error/ParseError";

export function createDefaultParser(): HandlebarsParser {
  return createHandlebarsParser({ plugins: [ContentPlugin, MustachePlugin] });
}
