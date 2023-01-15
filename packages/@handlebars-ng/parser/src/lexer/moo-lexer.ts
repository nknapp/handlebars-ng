import moo, { Lexer, Rules, ErrorRule } from "moo";
import { TokenType } from "./model";

type MyRules = { [x in TokenType]?: Rules[string] } & { error?: ErrorRule };
type MyStates = { [x: string]: MyRules };

const mustacheRules: MyRules = {
  SPACE: { match: /[ \t\n]/, lineBreaks: true },
  ID: /[^\n \t!"#%&'()*+,./;<=>@[\\\]^`{|}~]+/,
  SQUARE_WRAPPED_ID: {
    match: /\[[^[]*?\]/,
    value: (text) => text.slice(1, -1),
  },
  STRIP: "~",
  DOT: ".",
  error: { error: true },
};

const states: MyStates = {
  main: {
    OPEN_UNESCAPED: { match: /{{{/, push: "unescapedMustache" },
    OPEN: { match: /{{/, push: "mustache" },
    ESCAPED_MUSTACHE: { match: /\\\{\{/, value: (text) => text.slice(1) },
    CONTENT: { fallback: true, lineBreaks: true },
  },
  mustache: {
    CLOSE: {
      match: /}}/,
      pop: 1,
    },
    ...mustacheRules,
  },
  unescapedMustache: {
    CLOSE_UNESCAPED: {
      match: /}}}/,
      pop: 1,
    },
    ...mustacheRules,
  },
};

export function createHandlebarsMooLexer(): Lexer {
  return moo.states(states);
}
