import { Helper } from "@handlebars-ng/specification/tests";

// TODO: This file is copied from the specification repository right now.
// Better would be to compile the specification properly as library again

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
