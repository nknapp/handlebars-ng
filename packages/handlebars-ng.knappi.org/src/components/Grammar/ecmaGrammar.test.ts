import { EcmaGrammar } from "./ecmaGrammar";
import prettier from "prettier";

const grammarDefinition = `
Program :: 
    ContentStatement
    MustacheStatement

ContentStatement :: > any Unicode code point

MustacheStatement :: \`{{\` \`}}\`


MustacheStart[Escaped,Unescaped] :: \`{{\` \`}}\`

MustacheStart
  MustacheStart_Escaped
  MustacheStart_Unescaped

`;

describe("grammar", () => {
  it("returns a production html", async () => {
    const grammar = (
      await EcmaGrammar.fromString(grammarDefinition)
    ).selectProductions(["Program"]);

    const expected = `
    <div class="grammar">
      <div class="production">
        <span class="nonterminal">Program</span><span class="punctuation"> ::</span>
        <div class="rhs-list">
          <div class="rhs-list-item">
            <span class="rhs"><span class="nonterminal">ContentStatement</span></span>
          </div>
          <div class="rhs-list-item">
            <span class="rhs"><span class="nonterminal">MustacheStatement</span></span>
          </div>
      </div>
    </div>
    `;
    expect(normalizeHtml(grammar.html)).toEqual(normalizeHtml(expected));
  });

  it("can select another production", async () => {
    const grammar = (
      await EcmaGrammar.fromString(grammarDefinition)
    ).selectProductions(["ContentStatement"]);
    expect(normalizeHtml(grammar.html)).toEqual(
      normalizeHtml(`
      <div class='grammar'>
        <div class="production">
           <span class="nonterminal">ContentStatement</span><span class="punctuation"> ::</span>
           <span class="rhs"><span class="prose">any Unicode code point</span></span>
       </div></div>
  `)
    );
  });

  it("can select multiple productions", async () => {
    const grammar = (
      await EcmaGrammar.fromString(grammarDefinition)
    ).selectProductions(["ContentStatement", "MustacheStatement"]);
    expect(normalizeHtml(grammar.html)).toEqual(
      normalizeHtml(`
      <div class='grammar'>
        <div class="production">
          <span class="nonterminal">ContentStatement</span><span class="punctuation"> ::</span>
          <span class="rhs"><span class="prose">any Unicode code point</span></span>
        </div>
        <div class="production">
          <span class="nonterminal">MustacheStatement</span>
          <span class="punctuation"> ::</span>
          <span class="rhs">
            <span class="terminal">{{</span> <span class="terminal">}}</span>
          </span>
       </div>
      </div>
  `)
    );
  });

  it("can select productions with parameters", async () => {
    const grammar = (
      await EcmaGrammar.fromString(grammarDefinition)
    ).selectProductions(["MustacheStart"]);
    expect(normalizeHtml(grammar.html)).toEqual(
      normalizeHtml(`
      <div class='grammar'>
        <div class="production">
          <span class="nonterminal">ContentStatement</span><span class="punctuation"> ::</span>
          <span class="rhs"><span class="prose">any Unicode code point</span></span>
        </div>
        <div class="production">
          <span class="nonterminal">MustacheStatement</span>
          <span class="punctuation"> ::</span>
          <span class="rhs">
            <span class="terminal">{{</span> <span class="terminal">}}</span>
          </span>
       </div>
      </div>
  `)
    );
  });
});

function normalizeHtml(html: string) {
  return prettier.format(html, {
    parser: "html",
    htmlWhitespaceSensitivity: "ignore",
  });
}
