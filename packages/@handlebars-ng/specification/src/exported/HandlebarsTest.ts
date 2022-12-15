import type { Program } from "./ast";

export interface HandlebarsTest {
  description: string;
  template: string;
  ast: Program;
  input: Record<string, unknown>;
  helpers?: Record<string, string>;
  output: string;
  failsInOriginalHandlebars?: boolean;
}

export interface ExportedHandlebarsTest extends HandlebarsTest {
  filename: string;
}
