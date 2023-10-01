import type { Program } from "@handlebars-ng/abstract-syntax-tree";
import { normalizeAst } from "./normalizeAst";

describe("normalizeAst", () => {
  it("sorts props", () => {
    const normalizedAst = normalizeAst({
      type: "Program",
      blockParams: [],
      loc: {
        source: "",
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
            source: "",
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
        },
      ],
      strip: {},
    } satisfies Program);
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
        },
        "source": ""
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
    },
    "source": ""
  }
}`.trim(),
    );
  });
});
