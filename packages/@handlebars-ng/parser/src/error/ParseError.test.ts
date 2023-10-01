import { ParseError } from "./ParseError";

describe("ParseError", () => {
  it("points to the error if a location is given", () => {
    const error = new ParseError(
      "Test-Error",
      { line: 1, column: 0 },
      template(2, 2),
    );
    expect(error.message).toEqual(`Test-Error at 1:0
-----
1| 01 line=1
-+-^
2| 01 line=2`);
  });

  it("Shows two lines around the error in the snipped", () => {
    const error = new ParseError(
      "Test-Error",
      { line: 4, column: 3 },
      template(8, 5),
    );
    expect(error.message).toEqual(`Test-Error at 4:3
-----
2| 01234 line=2
3| 01234 line=3
4| 01234 line=4
-+----^
5| 01234 line=5
6| 01234 line=6`);
  });

  it("Left-pads line numbers", () => {
    const error = new ParseError(
      "Test-Error",
      { line: 8, column: 3 },
      template(10, 5),
    );
    expect(error.message).toEqual(`Test-Error at 8:3
-----
 6| 01234 line=6
 7| 01234 line=7
 8| 01234 line=8
 -+----^
 9| 01234 line=9
10| 01234 line=10`);
  });

  it("Uses visible line number only to determine padding", () => {
    const error = new ParseError(
      "Test-Error",
      { line: 4, column: 3 },
      template(20, 5),
    );
    expect(error.message).toEqual(`Test-Error at 4:3
-----
2| 01234 line=2
3| 01234 line=3
4| 01234 line=4
-+----^
5| 01234 line=5
6| 01234 line=6`);
  });
});

function template(lines: number, columns: number) {
  let result = "";
  for (let line = 1; line <= lines; line++) {
    for (let col = 0; col < columns; col++) {
      result += String(col % 10);
    }
    result += " line=" + line + "\n";
  }
  return result.trimEnd();
}
