import {
  createHandlebarsParser,
  HandlebarsParser,
} from "./core/createHandlebarsParser";
import { ContentPlugin } from "./plugins";

export { ParseError } from "./error/ParseError";

export function createDefaultParser(): HandlebarsParser {
  return createHandlebarsParser({ plugins: [ContentPlugin] });
}
