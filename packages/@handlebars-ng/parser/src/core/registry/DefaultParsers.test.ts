import { Parser } from "../types";
import { BooleanLiteral } from "@handlebars-ng/abstract-syntax-tree";
import { DefaultParsers } from "./DefaultParsers";

describe("ParserCollectionImpl", () => {
  it("adds and retrieves parser", () => {
    const parser: Parser<BooleanLiteral> = vi.fn();
    const collection = new DefaultParsers();
    collection.setDefaultParser("BooleanLiteral", parser);
    expect(collection.getDefaultParser("BooleanLiteral")).toBe(parser);
  });

  it("throws an exception if no parser was found", () => {
    const collection = new DefaultParsers();
    expect(() => collection.getDefaultParser("BooleanLiteral")).toThrow(
      "No default parser found for node type: BooleanLiteral",
    );
  });

  it("throws an exception if two parsers are added for the same node-type", () => {
    const collection = new DefaultParsers();
    collection.setDefaultParser("BooleanLiteral", vi.fn());
    expect(() =>
      collection.setDefaultParser("BooleanLiteral", vi.fn()),
    ).toThrow(
      "A default parser for this node-type was already registered: BooleanLiteral",
    );
  });
});
