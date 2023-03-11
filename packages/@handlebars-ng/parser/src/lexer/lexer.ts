/**
 * WORK IN PROGRESS
 *
 * This is a replacement for the moo-lexer, which we need for token lookahead
 */

import { Location } from "./model";

export type Rule = MatchRule | FallbackRule;

interface MatchRule {
  match: RegExp;
}

interface FallbackRule {
  fallback?: true;
}

export interface Token<T extends string> {
  type: T;
  original: string;
  value: string;
  start: Location;
  end: Location;
}

export class Lexer<States extends string, Types extends string> {
  states: Record<States | "main", LexerState<Types>>;
  currentState: LexerState<Types>;

  constructor(states: Record<States | "main", Record<Types, Rule>>) {
    this.states = mapValues(states, (state) => {
      return new LexerState(state);
    });
    this.currentState = this.states.main;
  }

  *lex(string: string): Generator<Token<Types>> {
    for (const token of this.currentState.lex(string)) {
      yield token;
    }
  }
}

class LexerState<Types extends string> {
  #fallback?: Fallback<Types>;
  #matchRegex: RegExp;
  #matchRules: MatchRule[] = [];
  #matchTypes: Types[] = [];

  constructor(rules: Record<Types, Rule>) {
    for (const [type, rule] of Object.entries<Rule>(rules)) {
      if (isFallbackRule(rule)) {
        this.#fallback = new Fallback(type as Types, rule);
      } else {
        this.#matchRules.push(rule);
        this.#matchTypes.push(type as Types);
      }
    }
    // If there is no fallback rules, we assume that every token must directly follow the previous token
    // thus, the regex must be sticky
    const sticky = this.#fallback == null;
    const regexes = this.#matchRules.map((rule) => rule.match);
    this.#matchRegex = matchAny(regexes, sticky);
  }

  *lex(string: string): Generator<Token<Types>> {
    let offset = 0;
    for (const match of string.matchAll(this.#matchRegex)) {
      if (match.index == null) {
        break;
      }
      if (match.index > offset && this.#fallback) {
        yield this.#fallback.createToken(string, offset, match.index);
      }
      const result = this.createTokenFromMatch(match);
      yield result;

      offset = match.index + result.original.length;
    }
    if (offset < string.length) {
      throw new Error(
        `Syntax error at 1:${offset}, expected one of ${this.#matchTypes
          .map((t) => `\`${t}\``)
          .join(", ")} but got '${string[offset]}'`
      );
    }
  }

  createTokenFromMatch(match: RegExpMatchArray): Token<Types> {
    for (let i = 1; i < match.length; i++) {
      const matchingGroup = match[i];
      if (matchingGroup != null && match.index != null) {
        return {
          type: this.#matchTypes[i - 1],
          original: matchingGroup,
          value: matchingGroup,
          start: { line: 1, column: match.index },
          end: { line: 1, column: match.index + matchingGroup.length },
        };
      }
    }
    throw new Error("Unexpected: Did not find token in matcher array");
  }
}

class Fallback<Types extends string> {
  #rule: FallbackRule;
  #type: Types;

  constructor(type: Types, rule: FallbackRule) {
    this.#type = type;
    this.#rule = rule;
  }

  createToken(string: string, from: number, to: number): Token<Types> {
    const original = string.substring(from, to);
    return {
      type: this.#type,
      value: original,
      original,
      start: { line: 1, column: from },
      end: { line: 1, column: to },
    };
  }
}

function isFallbackRule(rule: Rule): rule is FallbackRule {
  return (rule as FallbackRule).fallback === true;
}

function matchAny(regexList: RegExp[], sticky: boolean): RegExp {
  const sources = regexList.map((regex) => `(${regex.source})`);
  return new RegExp(sources.join("|"), sticky ? "yg" : "g");
}

function mapValues<K extends string, In, Out>(
  input: Record<K, In>,
  mapFn: (v: In) => Out
): Record<K, Out> {
  return Object.fromEntries(
    Object.entries<In>(input).map((entry) => [entry[0], mapFn(entry[1])])
  ) as Record<K, Out>;
}
