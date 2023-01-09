import moo, { Lexer, Rules } from "moo";
import { TokenType } from "./model";

type MyRules = { [x in TokenType]?: Rules[string] };
type MyStates = { [x: string]: MyRules };

const mustacheRules: MyRules = {
  SPACE: / +/,
  ID: /\w+/,
  STRIP: "~",
  DOT: ".",
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
