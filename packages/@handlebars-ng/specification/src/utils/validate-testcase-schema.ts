import { Validator } from "jsonschema";
import testSchema from "@/spec/schema/testcase.json";

const validator = new Validator();

export function validateTestcaseSchema(testcase: unknown) {
  return validator.validate(testcase, testSchema, { nestedErrors: true })
    .errors;
}
