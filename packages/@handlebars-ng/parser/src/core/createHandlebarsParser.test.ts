import { createHandlebarsParser } from "./createHandlebarsParser";
import { vi } from "vitest";
import { tok } from "./utils/tok";
import {
  CommentStatement,
  ContentStatement,
  MustacheStatement,
} from "@handlebars-ng/abstract-syntax-tree";
import { loc } from "../test-utils/loc";
import { HandlebarsParserPlugin } from "./types";

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
});

it("uses multiple lexer states", () => {
  const parser = createHandlebarsParser({
    plugins: [testContentPlugin, testMustachePlugin],
  });
  const program = parser.parse("a{{}}c");
  expect(program.body).toEqual([
    {
      type: "ContentStatement",
      loc: loc("1:0-1:1"),
      value: "a",
      original: "a",
    },
    {
      type: "MustacheStatement",
      loc: loc("1:1-1:5"),
      strip: { open: false, close: false },
      escaped: true,
      params: [],
      path: {
        type: "PathExpression",
        loc: loc("1:0-1:0"),
        depth: 0,
        data: false,
        parts: [],
        original: "",
      },
    },
    {
      type: "ContentStatement",
      loc: loc("1:5-1:6"),
      value: "c",
      original: "c",
    },
  ]);
});

const testContentPlugin: HandlebarsParserPlugin = {
  statement(registry) {
    registry.setFallbackRule({ type: "CONTENT" });
    const startToken = tok("CONTENT");
    registry.addParser<ContentStatement>(
      startToken,
      (context): ContentStatement => {
        const content = context.tokens.eat(startToken);
        return {
          type: "ContentStatement",
          loc: context.tokens.location(content, content),
          value: content.value,
          original: content.original,
        };
      }
    );
  },
};

const testCommentPlugin: HandlebarsParserPlugin = {
  statement(registry) {
    registry.addMatchRule({ type: "COMMENT", match: /\{\{!.*?}}/ });
    const startToken = tok("COMMENT");
    registry.addParser<CommentStatement>(
      startToken,
      (context): CommentStatement => {
        const comment = context.tokens.eat(startToken);
        return {
          type: "CommentStatement",
          loc: context.tokens.location(comment, comment),
          value: comment.value,
          strip: { open: false, close: false },
        };
      }
    );
  },
};

const testMustachePlugin: HandlebarsParserPlugin = {
  statement(registry) {
    registry.addMatchRule({ type: "OPEN", match: "{{", next: "mustache" });

    const TOK_OPEN = tok("OPEN");
    const TOK_CLOSE = tok("CLOSE");

    registry.addState("mustache", {
      fallbackRule: null,
      matchRules: [{ type: "CLOSE", match: "}}", next: "main" }],
    });
    registry.addParser<MustacheStatement>(
      TOK_OPEN,
      (context): MustacheStatement => {
        const open = context.tokens.eat(TOK_OPEN);
        const close = context.tokens.eat(TOK_CLOSE);
        return {
          type: "MustacheStatement",
          loc: context.tokens.location(open, close),
          strip: { open: false, close: false },
          escaped: true,
          params: [],
          path: {
            type: "PathExpression",
            loc: loc("1:0-1:0"),
            depth: 0,
            data: false,
            parts: [],
            original: "",
          },
        };
      }
    );
  },
};
