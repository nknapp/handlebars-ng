import { mapKeys } from "./mapKeys";

describe("mapKeys", () => {
  it("passes object keys through a function", () => {
    expect(mapKeys({ a: "x", b: "y" }, (key) => key + "1")).toEqual({
      a1: "x",
      b1: "y",
    });
  });
});
