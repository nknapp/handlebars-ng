import type { Helper } from "../types/helpers";

/**
 * Helpers used in the specification, written in TypeScript
 */

interface HelperSpec {
  description: string;
  // TODO: add "this" argument, specify Type for helper function (if possible)
  fn: (...args: unknown[]) => string;
}

export const helpers: Record<Helper, HelperSpec> = {
  return_literal_a: {
    description: "Returns the literal string 'a'",
    fn() {
      return "a";
    },
  },
};