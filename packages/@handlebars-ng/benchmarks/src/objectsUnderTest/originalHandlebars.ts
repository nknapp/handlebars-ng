import { ObjectUnderTest } from "../types/types";
import Handlebars from "handlebars";

const parser: ObjectUnderTest = {
  name: "original parser",
  testFn(test) {
    const hbsInstance = Handlebars.create();
    return () => {
      hbsInstance.parse(test.template);
    };
  },
};

const runner: ObjectUnderTest = {
  name: "original runner",
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
