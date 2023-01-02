import { ObjectUnderTest } from "src/types/types";

import { compile } from "@handlebars-ng/runner";
import { parse } from "@handlebars-ng/parser";

export const ngParser: ObjectUnderTest = {
  name: "ng parser",
  createRunner(test) {
    return {
      run: (): void => {
        parse(test.template);
      },
    };
  },
};

export const ngRunner: ObjectUnderTest = {
  name: "ng runner",
  createRunner(test) {
    const ast = parse(test.template);
    return {
      run: (): void => {
        compile(ast)(test.input);
      },
    };
  },
};
