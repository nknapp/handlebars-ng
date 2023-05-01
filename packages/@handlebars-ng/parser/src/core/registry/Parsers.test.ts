import { Parsers } from "./Parsers";
import { TokenType } from "baa-lexer";
import { HbsLexerTypes } from "../../model/lexer";

describe("StatementRegistryImpl", () => {
  it("add parsers", () => {
    const registry = new Parsers();
    const parser = vi.fn();
    registry.addParser(
      new Set<TokenType<HbsLexerTypes>>(["OPEN", "CLOSE"]),
      parser
    );
    expect(registry.parsers.get("OPEN")).toEqual(parser);
    expect(registry.parsers.get("CLOSE")).toEqual(parser);
  });
});
