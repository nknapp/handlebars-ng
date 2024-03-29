/* These definitions were originally imported from https://github.com/DefinitelyTyped/DefinitelyTyped
 * and may include contributions from the DefinitelyTyped community by:
 *   - Albert Willemsen <https://github.com/AlbertWillemsen-Centric>
 *   - Boris Yankov <https://github.com/borisyankov>
 *   - Jessica Franco <https://github.com/Kovensky>
 *   - Masahiro Wakame <https://github.com/vvakame>
 *   - Raanan Weber <https://github.com/RaananW>
 *   - Sergei Dorogin <https://github.com/evil-shrike>
 *   - webbiesdk <https://github.com/webbiesdk>
 *   - Andrew Leedham <https://github.com/AndrewLeedham>
 *   - Nils Knappmeier <https://github.com/nknapp>
 * For full history prior to their migration to handlebars.js, please see:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/commits/1ce60bdc07f10e0b076778c6c953271c072bc894/types/handlebars/index.d.ts
 */
export interface Program extends Node {
  type: "Program";
  body: Statement[];
  blockParams?: string[];
  strip: Record<string, never>;
}

export type AnyNode = Statement | Program | Expression;
export type Statement = ContentStatement | MustacheStatement | CommentStatement;
export type Expression = PathExpression | Literal | SubExpression;
export type Literal = StringLiteral | NumberLiteral | BooleanLiteral;

export interface ContentStatement extends Node {
  type: "ContentStatement";
  value: string;
  original: string;
}

interface NodeByType {
  ContentStatement: ContentStatement;
}

interface CommentStatement extends Node {
  type: "CommentStatement";
  value: string;
  strip: StripFlags;
}

interface NodeByType {
  CommentStatement: CommentStatement;
}

export interface StripFlags {
  open: boolean;
  close: boolean;
}

export interface MustacheStatement extends Node {
  type: "MustacheStatement";
  escaped: boolean;
  params: Expression[];
  path: PathExpression;
  strip: StripFlags;
}

interface NodeByType {
  MustacheStatement: MustacheStatement;
}

export interface PathExpression extends Node {
  type: "PathExpression";
  depth: number;
  data: boolean;
  parts: string[];
  strict?: boolean;
  original: string;
}

interface NodeByType {
  PathExpression: PathExpression;
}

export interface Node {
  type: string;
  loc: SourceLocation;
}

export interface SourceLocation {
  source?: string;
  start: Position;
  end: Position;
}

export interface Position {
  line: number;
  column: number;
}

interface StringLiteral extends Node {
  type: "StringLiteral";
  value: string;
  original: string;
}

interface NodeByType {
  StringLiteral: StringLiteral;
}

interface NumberLiteral extends Node {
  type: "NumberLiteral";
  value: number;
  original: string;
}

interface NodeByType {
  NumberLiteral: NumberLiteral;
}

interface BooleanLiteral extends Node {
  type: "BooleanLiteral";
  value: boolean;
  original: string;
}

interface NodeByType {
  BooleanLiteral: BooleanLiteral;
}

interface SubExpression extends Node {
  type: "SubExpression";
  path: PathExpression;
  params: Expression[];
}

interface NodeByType {
  SubExpression: SubExpression;
}
