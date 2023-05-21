import {
  createHandlebarsParser,
  HandlebarsParser,
} from "./core/createHandlebarsParser";
import { ContentPlugin } from "./plugins";
import { MustachePluginEscaped, MustachePluginUnescaped } from "./plugins";

export { ParseError } from "./error/ParseError";

export function createDefaultParser(): HandlebarsParser {
  return createHandlebarsParser({
    plugins: [ContentPlugin, MustachePluginUnescaped, MustachePluginEscaped],
  });
}
