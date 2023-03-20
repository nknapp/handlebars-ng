import { parseLocation } from "../test-utils/parseLocation";
import { endLocationMultiline } from "./endLocationMultiline";

describe("endLocationMultiline", () => {
  it("returns the start location if the string is empty", () => {
    testEndLocation("4:4", "", "4:4");
  });

  it("increases the column index by the number or chars, if no newlines are in the string", () => {
    testEndLocation("4:4", "aa", "4:6");
  });

  it("return 'n+1:0' if the string ends with the only newline", () => {
    testEndLocation("4:4", "12345\n", "5:0");
  });

  it("return 'n+2:0' if the string ends with one of two newlines", () => {
    testEndLocation("4:4", "12\n345\n", "6:0");
  });

  it("adjusts the colIndex based on the last position of a newline in the string", () => {
    testEndLocation("4:4", "12\n\n45", "6:2");
  });
});

function testEndLocation(start: string, tokenString: string, end: string) {
  expect(endLocationMultiline(parseLocation(start), tokenString)).toEqual(
    parseLocation(end)
  );
}
