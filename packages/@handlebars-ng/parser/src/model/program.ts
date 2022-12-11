import {Node} from "./node";


export interface Program extends Node {
    type: "Program",
    body: Statement[];
    blockParams?: string[];
    strip: {}
}

export type AnyNode = Statement | Program
export type Statement = ContentStatement | MustacheStatement

export interface ContentStatement extends Node {
    type: 'ContentStatement';
    value: string;
    original: string;
}


export interface StripFlags {
    open: boolean;
    close: boolean;
}

export interface MustacheStatement extends Node {
    type: 'MustacheStatement';
    escaped: boolean,
    params: string[]
    path: PathExpression;
    strip: StripFlags
}
export interface PathExpression extends Node {
    type: 'PathExpression';
    depth: number;
    data: boolean;
    parts: string[];
    original: string;
}

