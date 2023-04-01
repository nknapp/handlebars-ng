import { findCommonChar } from "./findCommonChars";

describe("findCommonChars", function () {
  it("returns null for two empty strings", function () {
    expect(findCommonChar(["", ""])).toEqual(null);
  });

  it("returns the first char of to equal strings", function () {
    expect(findCommonChar(["a", "a"])).toEqual({ char: "a", maxIndex: 0 });
  });

  it("returns null the strings have no common chars", function () {
    expect(findCommonChar(["a", "b"])).toEqual(null);
  });

  it("returns the first char of two strings with the same prefix", () => {
    expect(findCommonChar(["ab", "ac"])).toEqual({ char: "a", maxIndex: 0 });
  });

  it("returns 'a' for 'ab' and 'ca'", () => {
    expect(findCommonChar(["ab", "ca"])).toEqual({ char: "a", maxIndex: 1 });
  });

  it("returns only chars commons on all strings (if more than two)", () => {
    expect(findCommonChar(["1a2", "1a3", "56a"])).toEqual({
      char: "a",
      maxIndex: 2,
    });
  });

  it("returns only chars commons on all strings (if more than two)", () => {
    expect(findCommonChar(["1a2", "1a3", "56a"])).toEqual({
      char: "a",
      maxIndex: 2,
    });
  });
});
