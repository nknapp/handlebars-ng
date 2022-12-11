export interface Node {
    type: string;
    loc: SourceLocation;
}

interface SourceLocation {
    source?: string;
    start: Position;
    end: Position;
}

interface Position {
    line: number;
    column: number;
}
