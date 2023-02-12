import { SpecialLinksConfig } from ".";
import {
  DATA,
  FILENAME,
  HASH,
  ImportSpec,
  JsxComponentCall,
  LinkCollector,
} from "./LinkCollector";

const config: SpecialLinksConfig = {
  baseDir: "./source",
  links: [
    {
      match: /hb-spec\.json(#.*?)?$/,
      component: "@/components/Testcase/index.astro",
      propMapping: {
        filename: FILENAME,
        hash: HASH,
        spec: DATA,
      },
    },
  ],
};

describe("LinkCollector", () => {
  it("ignores unspecified links", () => {
    const collector = new LinkCollector("./source/01/file.md", config);

    const node = collector.replacementForLink("./some-link");
    expect(node).toBeNull();
  });

  it("returns a node for configured links", () => {
    const collector = new LinkCollector("./source/01/file.md", config);
    const replacementSpec = collector.replacementForLink(
      "./some-test.hb-spec.json#hash"
    );
    expect(replacementSpec).toEqual({
      jsxElementName: expect.any(String),
      props: {
        filename: {
          type: "string",
          value: "01/some-test.hb-spec.json",
        },
        spec: {
          type: "identifier",
          value: expect.any(String),
        },
        hash: {
          type: "string",
          value: "hash",
        },
      },
    } satisfies JsxComponentCall);
  });

  it("adds an import for the generated link", () => {
    const collector = new LinkCollector("./source/01/file.md", config);
    const replacementSpec = collector.replacementForLink(
      "./some-test.hb-spec.json#hash"
    );
    const variableName = replacementSpec?.props.spec.value;
    assertNotNull(variableName);

    expect(collector.imports).toContainEqual({
      name: variableName,
      source: "./some-test.hb-spec.json",
    } satisfies ImportSpec);
  });

  it("adds a query to the data import, if configured", () => {
    const collector = new LinkCollector("./source/01/file.md", {
      baseDir: "./source",
      links: [
        {
          match: /hb-spec\.json$/,
          dataImportQuery: "?raw",
          component: "@/components/Testcase/index.astro",
          propMapping: {
            filename: FILENAME,
            spec: DATA,
          },
        },
      ],
    });
    const replacementSpec = collector.replacementForLink(
      "./some-test.hb-spec.json"
    );
    const variableName = replacementSpec?.props.spec.value;

    assertNotNull(variableName);

    expect(collector.imports).toContainEqual({
      name: variableName,
      source: "./some-test.hb-spec.json?raw",
    } satisfies ImportSpec);
  });

  it("adds an import for component", () => {
    const collector = new LinkCollector("./source/01/file.md", config);
    const replacementSpec = collector.replacementForLink(
      "./some-test.hb-spec.json"
    );
    const variableName = replacementSpec?.jsxElementName;

    assertNotNull(variableName);

    expect(collector.imports).toContainEqual({
      name: variableName,
      source: "@/components/Testcase/index.astro",
    } satisfies ImportSpec);
  });

  it("reuses import variables for the same import source", () => {
    const collector = new LinkCollector("./source/01/file.md", config);
    const replacementSpec1 = collector.replacementForLink(
      "./some-test.hb-spec.json"
    );
    const variableName1 = replacementSpec1?.jsxElementName;
    assertNotNull(variableName1);

    const replacementSpec2 = collector.replacementForLink(
      "./some-test.hb-spec.json"
    );
    const variableName2 = replacementSpec2?.jsxElementName;
    assertNotNull(variableName2);

    expect(variableName1).toEqual(variableName2);
    expect(count(collector.imports, ({ name }) => name === variableName1)).toBe(
      1
    );
  });
});

function assertNotNull<T>(value: T | null | undefined): asserts value is T {
  expect(value).not.toBeNull();
  expect(value).not.toBeUndefined();
}

function count<T>(values: Iterable<T>, predicate: (v: T) => boolean): number {
  let counter = 0;
  for (const v of values) {
    if (predicate(v)) counter++;
  }
  return counter;
}
