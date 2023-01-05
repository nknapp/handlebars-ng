import { Program } from "./ast";

export interface HandlebarsTest {
  $schema: string;
  description: string;
  template: string;
  ast: Program;
  input: Record<string, unknown>;
  helpers?: Record<string, string>;
  output: string;
  /**
   * The AST created by the original Handlebars parser, in case it is different from "ast"
   */
  originalAst: unknown;
  /**
   * The original Handlebars parser cannot parse the template in this test
   */
  originalParseError: boolean;
}

export interface ExportedHandlebarsTest extends HandlebarsTest {
  filename: string;
}

declare const handlebarsSpec: ExportedHandlebarsTest[];
