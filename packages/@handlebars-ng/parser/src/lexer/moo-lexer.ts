import moo, {Lexer, Rules} from "moo";
import {TokenType} from "./model";

type MyRules = {[x in TokenType]?: Rules[string] }
type MyStates = {[x: string]: MyRules }

const states: MyStates = {
    main: {
        OPEN_UNESCAPED: {match: /{{{/, push: 'unescapedMustache'},
        OPEN: {match: /{{/, push: 'mustache'},
        CONTENT: {fallback: true}
    },
    mustache: {
        CLOSE: {
            match: /}}/, pop: 1,
        },
        SPACE: / +/,
        ID: /\w+/
    },
    unescapedMustache: {
        CLOSE_UNESCAPED: {
            match: /}}}/, pop: 1,
        },
        SPACE: / +/,
        ID: /\w+/
    }
}

export function createHandlebarsMooLexer(): Lexer {
    return moo.states(states)
}


