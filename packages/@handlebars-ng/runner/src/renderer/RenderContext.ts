import { Helper } from "../types";

export interface RenderContext {
  input: Record<string, unknown>;
  output: string;
  helpers: Map<string, Helper>;
}
