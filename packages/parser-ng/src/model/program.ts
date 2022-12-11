import {Node} from "./node";


export interface Program extends Node {
    type: "Program",
    body: Statement[];
    blockParams?: string[];
    strip: {}
}

export type AnyNode = Statement | Program
export type Statement = ContentStatement

export interface ContentStatement extends Node {
    type: 'ContentStatement';
    value: string;
    original: string;
}

