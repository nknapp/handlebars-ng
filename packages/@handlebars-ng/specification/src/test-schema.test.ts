import { loadTestcases } from "./utils/testcases";
import path from "node:path";
import { validateTestcaseSchema } from "./utils/validate-testcase-schema";

const testcases = await loadTestcases();

describe("testcase schema validation", () => {
  for (const [filename, testcase] of Object.entries(testcases)) {
    describe(filename, () => {
      it("has the correct $schema value", () => {
        const testcaseDir = path.dirname(filename);
        const expected = path.relative(testcaseDir, "schema/testcase.json");
        expect(testcase.$schema).toEqual(expected);
      });

      it("matches the schema", () => {
        const errors = validateTestcaseSchema(testcase);
        expect(errors).toHaveLength(0);
      });
    });
  }
});
