import { ObjectUnderTest } from "../types/types";
import Handlebars from "handlebars";

const parser: ObjectUnderTest = {
  name: "original parser",
  createRunner(test) {
    const hbsInstance = Handlebars.create();
    return {
      run: (): void => {
        hbsInstance.parse(test.template);
      },
    };
  },
};

const runner: ObjectUnderTest = {
  name: "original runner",
  createRunner(test) {
    const hbsInstance = Handlebars.create();
    const template = hbsInstance.compile(test.template);
    template(test.input);
    return {
      run: (): void => {
        template(test.input);
      },
    };
  },
};

export const originalHandlebars = {
  parser,
  runner,
};
