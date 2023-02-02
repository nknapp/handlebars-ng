import {
  Expression,
  Program,
  Statement,
} from "@handlebars-ng/abstract-syntax-tree";
import { HelperFn } from "../types/helper";

export interface Evaluator {
  evaluate(context: EvaluationContext): unknown;
}

export interface EvaluationContext {
  input: unknown;
  helpers: Map<string, HelperFn>;
}

export interface Renderer {
  render(context: RenderContext): void;
}

export interface RenderContext {
  input: Record<string, unknown>;
  output: string;
  helpers: Map<string, HelperFn>;
}

export interface NodeMapping {
  createEvaluator(this: this, node: Expression): Evaluator;
  createRenderer(this: this, node: Statement | Program): Renderer;
}
