import { cssUrls } from "./cssUrls";

describe("cssUrls", () => {
  it("wraps each path with an 'url()' block", () => {
    expect(cssUrls({ a: "/src/a", b: "/src/b" })).toEqual({
      a: "url('/src/a')",
      b: "url('/src/b')",
    });
  });
});
