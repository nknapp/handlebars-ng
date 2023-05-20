import { StatementRegistryImpl } from "./StatementRegistry";
import { TokenType } from "baa-lexer";
import { HbsLexerTypes } from "../model/lexer";

describe("StatementRegistryImpl", () => {
  it("set fallback rule", () => {
    const registry = new StatementRegistryImpl();
    registry.setFallbackRule({ type: "CONTENT" });
    expect(registry.fallbackRule).toEqual({ type: "CONTENT" });
  });

  it("cannot set fallback rule twice", () => {
    const registry = new StatementRegistryImpl();
    registry.setFallbackRule({ type: "CONTENT" });
    expect(() => registry.setFallbackRule({ type: "CONTENT" })).toThrow(
      "Only one fallback rule is allowed, and this one already exists: CONTENT"
    );
    expect(registry.fallbackRule).toEqual({ type: "CONTENT" });
  });

  it("adds match rules", () => {
    const registry = new StatementRegistryImpl();
    registry.addMatchRule({ type: "OPEN", match: "{{" });
    registry.addMatchRule({ type: "CLOSE", match: "}}" });
    expect(registry.matchRules).toEqual([
      { type: "OPEN", match: "{{" },
      { type: "CLOSE", match: "}}" },
    ]);
  });

  it("add parsers", () => {
    const registry = new StatementRegistryImpl();
    const parser = vi.fn();
    registry.addParser(
      new Set<TokenType<HbsLexerTypes>>(["OPEN", "CLOSE"]),
      parser
    );
    expect(registry.parsers.get("OPEN")).toEqual(parser);
    expect(registry.parsers.get("CLOSE")).toEqual(parser);
  });

  it("add state", () => {
    const registry = new StatementRegistryImpl();
    registry.addState("mustache", {
      fallbackRule: { type: "CONTENT" },
      matchRules: [{ type: "OPEN", match: "{{" }],
    });

    expect(registry.states.get("mustache")).toEqual({
      fallbackRule: { type: "CONTENT" },
      matchRules: [{ type: "OPEN", match: "{{" }],
    });
  });
});
