import { Program } from "@handlebars-ng/abstract-syntax-tree";

export interface Executor {
  parse(template: string): Promise<Program>;
}

export interface HandlebarsAdapter {
  parse(template: string): Program | Promise<Program>;
}
