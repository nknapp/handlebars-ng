import { Registry } from "./Registry";
import { ExpressionParser } from "./ExpressionParser";

class TestBoolean implements ExpressionParser {
  readonly rules = { BOOLEAN: /[tf]/ };
  readonly startTokens = ["BOOLEAN"] as const;
  parse = vi.fn();
}

class TestNumber implements ExpressionParser {
  readonly rules = { NUMBER: /\d+/ };
  readonly startTokens = ["NUMBER"] as const;
  parse = vi.fn();
}

describe("Registry", () => {
  describe("registerExpression", () => {
    it("adds rules to 'expressionRules'", () => {
      const registry = new Registry();
      registry.registerExpression(new TestBoolean());
      registry.registerExpression(new TestNumber());
      expect(registry.expressionRules).toEqual({
        BOOLEAN: /[tf]/,
        NUMBER: /\d+/,
      });
    });

    it("adds parsers to 'expressionParsers'", () => {
      const registry = new Registry();
      const testBoolean = new TestBoolean();
      registry.registerExpression(testBoolean);
      const testNumber = new TestNumber();
      registry.registerExpression(testNumber);
      expect(registry.expressionParsers).toEqual([testBoolean, testNumber]);
    });
  });
});
