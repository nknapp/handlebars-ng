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
