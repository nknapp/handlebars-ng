import {Program} from "../model/program";


export function parse(template: string): Program {
    return {
        type: "Program",
        loc: {
            start: {line: 1, column: 0},
            end: {line: 1, column: template.length}
        },
        body: [
            {
                type: "ContentStatement",
                loc: {
                    start: {line: 1, column: 0},
                    end: {line: 1, column: 21}
                },
                value: template,
                original: template
            }
        ],
        strip: {}
    }
}
