import { ObjectUnderTest } from "../types/types";
import Handlebars, { HelperDeclareSpec } from "handlebars";

const version = Handlebars.VERSION;

const parser: ObjectUnderTest = {
  name: `Handlebars ${version} (parser)`,
  testFn(test) {
    const hbsInstance = Handlebars.create();
    return () => {
      hbsInstance.parse(test.template);
    };
  },
};

const runner: ObjectUnderTest = {
  name: `Handlebars ${version} (template)`,
  testFn(test) {
    const hbsInstance = Handlebars.create();
    if (test.helpers != null) {
      hbsInstance.registerHelper(test.helpers as HelperDeclareSpec);
    }
    const template = hbsInstance.compile(test.template);
    return () => {
      template(test.input);
    };
  },
};

export const originalHandlebars = {
  parser,
  runner,
};
