import { Program } from "@handlebars-ng/abstract-syntax-tree";
import { Executor, HandlebarsAdapter } from "./Executor.types";

export class LocalExecutor implements Executor {
  private readonly impl: HandlebarsAdapter;
  private ast: Program | null = null;

  constructor(impl: HandlebarsAdapter) {
    this.impl = impl;
  }

  async parse(template: string): Promise<Program> {
    this.ast = await this.impl.parse(template);
    return this.ast;
  }
}
