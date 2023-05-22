import {
  createHandlebarsParser,
  HandlebarsParser,
} from "./core/createHandlebarsParser";
import {
  BooleanLiteralPlugin,
  ContentPlugin,
  NumberLiteralPlugin,
  PathExpressionPlugin,
  StringLiteralPlugin,
} from "./plugins";
import { MustachePluginEscaped, MustachePluginUnescaped } from "./plugins";

export { ParseError } from "./error/ParseError";

export function createDefaultParser(): HandlebarsParser {
  return createHandlebarsParser({
    plugins: [
      ContentPlugin,
      MustachePluginUnescaped,
      MustachePluginEscaped,
      BooleanLiteralPlugin,
      NumberLiteralPlugin,
      StringLiteralPlugin,
      PathExpressionPlugin,
    ],
  });
}
