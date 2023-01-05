import type { ContentStatement } from "types/ast";
import { normalizeAst } from "./normalizeAst";

describe("normalizeAst", () => {
  it("sorts props", () => {
    const normalizedAst = normalizeAst({
      type: "Program",
      blockParams: [],
      loc: {
        start: {
          line: 1,
          column: 0,
        },
        end: {
          line: 2,
          column: 7,
        },
      },
      body: [
        {
          loc: {
            start: {
              line: 1,
              column: 0,
            },
            end: {
              line: 2,
              column: 7,
            },
          },
          type: "ContentStatement",
          value: "test",
          original: "test",
        } as ContentStatement,
      ],
      strip: {},
    });
    expect(JSON.stringify(normalizedAst, null, 2)).toBe(
      `
{
  "type": "Program",
  "blockParams": [],
  "body": [
    {
      "type": "ContentStatement",
      "value": "test",
      "original": "test",
      "loc": {
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 2,
          "column": 7
        }
      }
    }
  ],
  "strip": {},
  "loc": {
    "start": {
      "line": 1,
      "column": 0
    },
    "end": {
      "line": 2,
      "column": 7
    }
  }
}`.trim()
    );
  });
});
