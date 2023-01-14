import { Validator } from "jsonschema";
import testSchema from "@/spec/schema/testcase.json";
import { loadTestcases } from "./utils/testcases";
import path from "node:path";

const validator = new Validator();
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
        const result = validator.validate(testcase, testSchema);
        expect(result.errors).toHaveLength(0);
      });
    });
  }
});
