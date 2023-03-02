import type { Helper } from "../types/helpers";

/**
 * Helpers used in the specification, written in TypeScript
 */

interface HelperSpec {
  description: string;
  // TODO: add "this" argument, specify Type for helper function (if possible)
  fn: (...args: unknown[]) => unknown;
}

export const helpers: Record<Helper, HelperSpec> = {
  return_literal_a: {
    description: "Returns the literal string 'a'",
    fn() {
      return "a";
    },
  },
  concat_strings: {
    description: "Concatenates two strings",
    fn(a, b) {
      return "" + a + b;
    },
  },
  identity: {
    description: "Returns the first parameter",
    fn(a) {
      return a;
    },
  },
};
