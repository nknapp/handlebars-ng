import { Grammar, EmitFormat } from "grammarkdown";
import { load } from "cheerio";

export class EcmaGrammar {
  static async fromString(grammar: string): Promise<EcmaGrammar> {
    const html = await Grammar.convert(grammar, { format: EmitFormat.html });
    const $ = load(html);
    const productionEntries: [string, string][] = $(".production")
      .toArray()
      .map((el) => {
        const name = $(el).find(" > .nonterminal").text();
        return [name, $(el).html() ?? ""];
      });
    return new EcmaGrammar(new Map<string, string>(productionEntries));
  }

  productions: Map<string, string>;

  constructor(productions: Map<string, string>) {
    this.productions = productions;
  }

  get html(): string {
    const productionHtml = [...this.productions.values()]
      .map((html) => `<div class="production">${html}</div>`)
      .join("\n");
    return `<div class='grammar'>${productionHtml}</div>`;
  }

  selectProductions(names: string[]): EcmaGrammar {
    const newMap = new Map<string, string>();
    for (const name of names) {
      newMap.set(name, this.productions.get(name) ?? "");
    }
    return new EcmaGrammar(newMap);
  }
}
