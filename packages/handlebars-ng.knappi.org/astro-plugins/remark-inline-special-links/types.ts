import type { Node } from "unist";

export interface SpecialLinksConfig {
  baseDir: string;
  links: SpecialLinkConfig[];
}

export interface SpecialLinkConfig {
  match: RegExp;
  component: string;
  propMapping: Record<string, symbol>;
}

export interface MyNode extends Node {
  children?: MyNode[] | null;
}
