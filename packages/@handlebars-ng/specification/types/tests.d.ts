import { Program } from "./ast";

export interface HandlebarsTest {
  $schema: string;
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

declare const handlebarsSpec: ExportedHandlebarsTest[];
