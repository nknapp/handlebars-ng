import { createHandlebarsParser } from "./createHandlebarsParser";
import { vi } from "vitest";
import { tok } from "./utils/tok";
import {
  CommentStatement,
  ContentStatement,
  MustacheStatement,
  PathExpression,
} from "@handlebars-ng/abstract-syntax-tree";
import { loc } from "../test-utils/loc";
import { HandlebarsParserPlugin, Parser } from "./types";

describe("createHandlebarsParse", () => {
  it("plugin's statement method is called", () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    createHandlebarsParser({
      plugins: [
        {
          statement: fn1,
        },
        {
          statement: fn2,
        },
      ],
    });
    expect(fn1).toHaveBeenCalled();
    expect(fn2).toHaveBeenCalled();
  });

  it("parses an empty string", () => {
    const parser = createHandlebarsParser({
      plugins: [testContentPlugin],
    });
    const ast = parser.parse("");
    expect(ast).toEqual({
      type: "Program",
      strip: {},
      body: [],
      loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 1 } },
    });
  });

  it("returns a single content", () => {
    const parser = createHandlebarsParser({
      plugins: [testContentPlugin],
    });
    const program = parser.parse("b");
    expect(program.body).toEqual([
      {
        type: "ContentStatement",
        loc: loc("1:0-1:1"),
        value: "b",
        original: "b",
      },
    ]);
  });

  it("returns a multiple tokens", () => {
    const parser = createHandlebarsParser({
      plugins: [testContentPlugin, testCommentPlugin],
    });
    const program = parser.parse("a{{!b}}c");
    expect(program.body).toEqual([
      {
        type: "ContentStatement",
        loc: loc("1:0-1:1"),
        value: "a",
        original: "a",
      },
      {
        type: "CommentStatement",
        loc: loc("1:1-1:7"),
        value: "{{!b}}",
        strip: { open: false, close: false },
      },
      {
        type: "ContentStatement",
        loc: loc("1:7-1:8"),
        value: "c",
        original: "c",
      },
    ]);
  });

  it("plugin's expression method is called", () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    createHandlebarsParser({
      plugins: [
        {
          statement: fn1,
        },
        {
          statement: fn2,
        },
      ],
    });
    expect(fn1).toHaveBeenCalled();
    expect(fn2).toHaveBeenCalled();
  });

  it("parses combination of statements and expressions", () => {
    const parser = createHandlebarsParser({
      plugins: [testContentPlugin, testMustachePlugin, testExpressionPlugin],
    });
    const program = parser.parse("a{{b param}}c");
    expect(program.body).toEqual([
      {
        type: "ContentStatement",
        loc: loc("1:0-1:1"),
        value: "a",
        original: "a",
      },
      {
        type: "MustacheStatement",
        loc: loc("1:1-1:12"),
        strip: { open: false, close: false },
        escaped: true,
        params: [
          {
            type: "PathExpression",
            loc: loc("1:5-1:10"),
            depth: 0,
            data: false,
            parts: ["param"],
            original: "param",
          },
        ],
        path: {
          type: "PathExpression",
          loc: loc("1:3-1:4"),
          depth: 0,
          data: false,
          parts: ["b"],
          original: "b",
        },
      },
      {
        type: "ContentStatement",
        loc: loc("1:12-1:13"),
        value: "c",
        original: "c",
      },
    ]);
  });
});

const testContentPlugin: HandlebarsParserPlugin = {
  statement({ lexerRules, addParser }) {
    lexerRules.setFallback({ type: "CONTENT" });
    const TOK_CONTENT = tok("CONTENT");
    addParser(TOK_CONTENT, (context): ContentStatement => {
      const content = context.tokens.eat(TOK_CONTENT);
      return {
        type: "ContentStatement",
        loc: context.tokens.location(content, content),
        value: content.value,
        original: content.original,
      };
    });
  },
};

const testCommentPlugin: HandlebarsParserPlugin = {
  statement({ lexerRules, addParser }) {
    lexerRules.add({ type: "COMMENT", match: /\{\{!.*?}}/ });
    const TOK_COMMENT = tok("COMMENT");
    addParser(TOK_COMMENT, (context): CommentStatement => {
      const comment = context.tokens.eat(TOK_COMMENT);
      return {
        type: "CommentStatement",
        loc: context.tokens.location(comment, comment),
        value: comment.value,
        strip: { open: false, close: false },
      };
    });
  },
};

const testMustachePlugin: HandlebarsParserPlugin = {
  statement({ lexerRules, expressionRules, addState, addParser }) {
    lexerRules.add({ type: "OPEN", match: "{{", next: "mustache" });

    const TOK_OPEN = tok("OPEN");
    const TOK_CLOSE = tok("CLOSE");
    const TOK_SPACE = tok("SPACE");

    addState("mustache", {
      fallbackRule: null,
      matchRules: [
        ...expressionRules.matchRules,
        { type: "SPACE", match: " " },
        { type: "CLOSE", match: "}}", next: "main" },
      ],
    });

    addParser(TOK_OPEN, (context): MustacheStatement => {
      const open = context.tokens.eat(TOK_OPEN);
      const path = context.parse("PathExpression");
      context.tokens.ignore(TOK_SPACE);
      const expression = context.parseExpression();
      const close = context.tokens.eat(TOK_CLOSE);
      return {
        type: "MustacheStatement",
        loc: context.tokens.location(open, close),
        strip: { open: false, close: false },
        escaped: true,
        params: [expression],
        path,
      };
    });
  },
};

const TOK_ID = tok("ID");

const testExpressionPlugin: HandlebarsParserPlugin = {
  expression(api) {
    api.lexerRules.add({ type: "ID", match: /\w+/ });
    api.setDefaultParser("PathExpression", parsePathExpression);
    api.addParser(TOK_ID, parsePathExpression);
  },
};

const parsePathExpression: Parser<PathExpression> = (context) => {
  const id = context.tokens.eat(TOK_ID);
  return {
    type: "PathExpression",
    loc: context.tokens.location(id, id),
    data: false,
    depth: 0,
    original: id.original,
    parts: [id.value],
  };
};
