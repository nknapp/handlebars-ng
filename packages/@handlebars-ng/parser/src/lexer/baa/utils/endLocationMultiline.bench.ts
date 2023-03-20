import { describe, bench } from "vitest";
import { endLocationMultiline } from "./endLocationMultiline";

describe.each([
  { name: "single line", string: "string ".repeat(200) },
  { name: "linebreak at start", string: "\n" + "string ".repeat(200) },
  { name: "linebreak at end", string: "string ".repeat(200) + "\n" },
  { name: "many linebreaks", string: "\nstring ".repeat(200) },
])("$name", () => {
  bench("endLocationMultiline", () => {
    endLocationMultiline({ line: 4, column: 4 }, "string ".repeat(200));
  });

  bench("alternative", () => {
    alternative({ line: 4, column: 4 }, "string ".repeat(200));
  });
});

// When trying out new implementations, put the original implementation here
// and modify endLocationMultiline to make comparisons.
const alternative = endLocationMultiline;
