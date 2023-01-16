import {
  escapeHtml,
  escapeHtmlReReplace,
  iterate,
  iterateSwitch,
  reExec,
  typedArray,
} from "./htmlEscape";

describe("htmlEscape", () => {
  it("htmlEscape", () => {
    expect(escapeHtml("&<>\"'`=")).toEqual(
      "&amp;&lt;&gt;&quot;&#x27;&#x60;&#x3D;"
    );
  });

  it("escapeHtmlReReplace", () => {
    expect(escapeHtmlReReplace("&<>\"'`=")).toEqual(
      "&amp;&lt;&gt;&quot;&#x27;&#x60;&#x3D;"
    );
  });

  it("iterate", () => {
    expect(iterate("&<>\"'`=")).toEqual(
      "&amp;&lt;&gt;&quot;&#x27;&#x60;&#x3D;"
    );
  });

  it("iterateSwitch", () => {
    expect(iterateSwitch("&<>\"'`=")).toEqual(
      "&amp;&lt;&gt;&quot;&#x27;&#x60;&#x3D;"
    );
  });

  it("reExec", () => {
    expect(reExec("test & xxx <>\"'`=")).toEqual(
      "test &amp; xxx &lt;&gt;&quot;&#x27;&#x60;&#x3D;"
    );
  });

  it("typedarray", () => {
    expect(typedArray("äötest & xxx <>\"'`=")).toEqual(
      "äötest &amp; xxx &lt;&gt;&quot;&#x27;&#x60;&#x3D;"
    );
  });
});
