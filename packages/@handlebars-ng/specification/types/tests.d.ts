import { Program } from "./ast";
import { Helper } from "./helpers";

export interface BaseHandlebarsTest {
  $schema: string;
  description: string;
  template: string;
  /**
   * If the output of Handlebars.js seems to be wrong, a description of this should be in this field.
   * That way, we can discuss the issues later. For now we should try to remain backwards compatible, so the "output"
   * field should be what Handlebars 4.x is creating.
   */
  possibleBug?: string;
  type: string;
}

export interface SuccessTest extends BaseHandlebarsTest {
  type: "success";
  ast: Program;
  input: Record<string, unknown>;
  helpers?: Record<string, Helper>;
  output: string;
  /**
   * The AST created by the original Handlebars parser, in case it is different from "ast"
   */
  originalAst?: unknown;
  /**
   * The original Handlebars parser cannot parse the template in this test
   */
  originalParseError?: true;
}

export interface ParseErrorTest extends BaseHandlebarsTest {
  type: "parseError";
  expected: ExpectedParseError;
  /**
   * The parse error that is returned by Handlebars 4.x, if different from expetation
   */
  originalMessage?: string;
}

export interface ExpectedParseError {
  line: number;
  column: number;
  message: string;
}

export type HandlebarsTest = ParseErrorTest | SuccessTest;

declare const handlebarsSpec: Record<string, HandlebarsTest>;
