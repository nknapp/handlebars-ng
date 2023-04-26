// TODO: Rename to "HelperName"
export type Helper =
  | "return_literal_a"
  | "concat_strings"
  | "identity"
  | "add"
  | "if_then_else";

/**
 * Describes each helper used in this spec
 */
export type Helpers = Record<Helper, string>;
