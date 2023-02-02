import { getOwnProperty } from "./getOwnProperty";

describe("getOwnProperty", () => {
  it("returns null if the property does not exist", () => {
    expect(getOwnProperty({ a: "x" }, "b")).toBeNull();
  });

  it("returns the property if it exists on the object", () => {
    expect(getOwnProperty({ a: "x" }, "a")).toEqual("x");
  });

  it("returns the property if it exists on the object (numbers)", () => {
    expect(getOwnProperty({ a: 2 }, "a")).toEqual(2);
  });

  it("returns null if the property is not an 'own property'", () => {
    expect(getOwnProperty({ a: 2 }, "constructor")).toBeNull();
  });
});
