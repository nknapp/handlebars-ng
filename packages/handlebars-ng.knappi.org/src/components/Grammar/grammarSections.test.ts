import { grammarSections } from "./grammarSections";

const grammarDefinition = `

// @section:Program

Program :: 
    ContentStatement
    MustacheStatement

// @section:Statements

ContentStatement :: > any Unicode code point

MustacheStatement :: \`{{\` \`}}\`

// @section:Mustaches

MustacheStart[Escaped,Unescaped] :: \`{{\` \`}}\`

MustacheStart
  MustacheStart_Escaped
  MustacheStart_Unescaped
`;

describe("grammarSections", () => {
  it("returns a section from the middle of the file", () => {
    expect(grammarSections(grammarDefinition, "Statements")).toEqual(deindent`
      |
      |ContentStatement :: > any Unicode code point
      |
      |MustacheStatement :: \`{{\` \`}}\`
      |`);
  });

  it("returns a section from the end of the file", () => {
    expect(grammarSections(grammarDefinition, "Mustaches")).toEqual(deindent`
      |
      |MustacheStart[Escaped,Unescaped] :: \`{{\` \`}}\`
      |
      |MustacheStart
      |  MustacheStart_Escaped
      |  MustacheStart_Unescaped
      |`);
  });
});

function deindent(strings: TemplateStringsArray) {
  return strings.join("").replace(/^ *\|/gm, "");
}
