import { loc } from "./loc";

describe("loc", () => {
  it("creates a mock location", () => {
    expect(loc("1:0-2:3")).toEqual({
      start: { line: 1, column: 0 },
      end: { line: 2, column: 3 },
    });
  });
});
