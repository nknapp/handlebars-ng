/**
 * WORK IN PROGRESS
 *
 * This is a replacement for the moo-lexer, which we need to token lookahead
 */

import { Location } from "./model";

export interface Rule {
  match: RegExp;
}

interface Matcher<Types> {
  regex: RegExp;
  groups: Types[];
}

export interface Token<T extends string> {
  type: T;
  original: string;
  value: string;
  start: Location;
  end: Location;
}

export class Lexer<States extends string, Types extends string> {
  matchers: Record<States | "main", Matcher<Types>>;
  currentMatcher: Matcher<Types>;

  constructor(states: Record<States | "main", Record<Types, Rule>>) {
    this.matchers = mapValues(states, (state) => ({
      regex: matchAny(Object.values<Rule>(state).map((rule) => rule.match)),
      groups: Object.keys(state) as Types[],
    }));
    this.currentMatcher = this.matchers.main;
  }

  *lex(string: string): Generator<Token<Types>> {
    for (const match of string.matchAll(this.currentMatcher.regex)) {
      yield this.#createToken(match);
    }
  }

  #createToken(match: RegExpMatchArray): Token<Types> {
    for (let i = 1; i < match.length; i++) {
      if (match[i] != null && match.index != null) {
        return {
          type: this.currentMatcher.groups[i - 1],
          original: match[i],
          value: match[i],
          start: { line: 1, column: match.index },
          end: { line: 1, column: match.index + 1 },
        };
      }
    }
    throw new Error("Unexpected: Did not find token in matcher array");
  }
}

function matchAny(regex: RegExp[]): RegExp {
  const group1 = "(" + regex[0].source + ")";
  const group2 = "(" + regex[1].source + ")";
  return new RegExp(group1 + "|" + group2, "yg");
}

function mapValues<K extends string, In, Out>(
  input: Record<K, In>,
  mapFn: (v: In) => Out
): Record<K, Out> {
  return Object.fromEntries(
    Object.entries<In>(input).map((entry) => [entry[0], mapFn(entry[1])])
  ) as Record<K, Out>;
}
