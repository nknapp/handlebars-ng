import { helpers as helpersUsedInSpec } from "@/spec/01-introduction/helpers";
import { SuccessTest } from "types/tests";
import Handlebars from "handlebars";

export function compileAndRun(testcase: SuccessTest): string {
  const instance = Handlebars.create();
  if (testcase.helpers != null) {
    for (const [name, helper] of Object.entries(testcase.helpers)) {
      instance.registerHelper(name, helpersUsedInSpec[helper].fn);
    }
  }
  const fn = instance.compile(testcase.template);
  return fn(testcase.input);
}
