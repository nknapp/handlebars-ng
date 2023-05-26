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
  SubExpressionPlugin,
} from "./plugins";
import { MustachePluginEscaped, MustachePluginUnescaped } from "./plugins";

export { ParseError } from "./error/ParseError";

export type { HandlebarsParser } from "./core/createHandlebarsParser";
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
      SubExpressionPlugin,
    ],
  });
}
