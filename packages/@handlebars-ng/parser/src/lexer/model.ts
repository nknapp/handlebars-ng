
export type MustacheOpenType = "OPEN_UNESCAPED" | "OPEN"
export type MustacheCloseType = "CLOSE_UNESCAPED" | "CLOSE"
export type TokenType = "CONTENT" | "SPACE" | "ID" | MustacheOpenType | MustacheCloseType

export type Location = {
    column: number;
    line: number;
}

export interface Token {
    type: TokenType;
    start: Location;
    end: Location;
    value: string
    original: string
}
