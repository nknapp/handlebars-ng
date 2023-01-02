import { ObjectUnderTest } from "src/types/types";
import Handlebars from "handlebars";

export const originalParser: ObjectUnderTest = {
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

export const originalRunner: ObjectUnderTest = {
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
