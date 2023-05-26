import { tok } from "../core/utils/tok";

export const LOOK_AHEAD = /[=~}\s/.)|]/;
export const LITERAL_LOOKAHEAD = /[~}\s)]/;

export const RULE_SPACE = {
  type: "SPACE",
  match: /[ \t\n]/,
  lineBreaks: true,
} as const;
export const TOK_SPACE = tok("SPACE");
