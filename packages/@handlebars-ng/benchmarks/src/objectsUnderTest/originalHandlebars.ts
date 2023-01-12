import { ObjectUnderTest } from "../types/types";
import Handlebars from "handlebars";

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
