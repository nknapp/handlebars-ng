import type { Helper } from "@handlebars-ng/specification/tests";

// TODO: Export this file property from the specification
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
