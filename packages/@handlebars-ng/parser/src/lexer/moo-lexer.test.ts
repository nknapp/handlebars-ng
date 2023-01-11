import { createHandlebarsMooLexer } from "./moo-lexer";

describe("moo-lexer", () => {
  it("keeps square-brackets in the 'text' property of wrapped id tokens ", () => {
    const lexer = createHandlebarsMooLexer();
    lexer.reset("{{ [ ]");
    expect([...lexer].map((token) => token.text)).toEqual(["{{", " ", "[ ]"]);
  });
});
