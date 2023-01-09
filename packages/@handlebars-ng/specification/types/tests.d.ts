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
  originalAst?: unknown;
  /**
   * The original Handlebars parser cannot parse the template in this test
   */
  originalParseError?: true;
  /**
   * If the output of Handlebars.js seems to be wrong, a description of this should be in this field.
   * That way, we can discuss the issues later. For now we should try to remain backwards compatible, so the "output"
   * field should be what Handlebars 4.x is creating.
   */
  possibleBug?: string;
}

export interface ExportedHandlebarsTest extends HandlebarsTest {
  filename: string;
}

declare const handlebarsSpec: ExportedHandlebarsTest[];
