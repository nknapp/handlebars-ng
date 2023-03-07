import moo, { Lexer, Rules, ErrorRule } from "moo";
import { TokenType } from "./model";

type MyRules = { [x in TokenType]?: Rules[string] } & { error?: ErrorRule };
type MyStates = { [x: string]: MyRules };

const mustacheRules: MyRules = {
  SPACE: { match: /[ \t\n]/, lineBreaks: true },
  NUMBER: {
    match: /-?\d+(?:\.\d+)?/,
  },
  ID: /[^\n \t!"#%&'()*+,./;<=>@[\\\]^`{|}~]+/,
  SQUARE_WRAPPED_ID: {
    match: /\[[^[]*?\]/,
    value: (text) => text.slice(1, -1),
  },
  STRIP: "~",
  DOT: ".",
  SLASH: /\//,
  STRING_LITERAL_DOUBLE_QUOTE: {
    match: /"[^"]+"/,
    value: (text) => text.slice(1, -1),
  },
  STRING_LITERAL_SINGLE_QUOTE: {
    match: /'[^']+'/,
    value: (text) => text.slice(1, -1),
  },
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
