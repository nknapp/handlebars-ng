import { HelperFn } from "../types/helper";

export interface RenderContext {
  input: Record<string, unknown>;
  output: string;
  helpers: Map<string, HelperFn>;
}
