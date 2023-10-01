import { RuleCollectionImpl } from "./RuleCollectionImpl";

describe("RuleCollectionImpl", () => {
  it("set fallback rule", () => {
    const registry = new RuleCollectionImpl();
    registry.setFallback({ type: "CONTENT" });
    expect(registry.fallbackRule).toEqual({ type: "CONTENT" });
  });

  it("cannot set fallback rule twice", () => {
    const registry = new RuleCollectionImpl();
    registry.setFallback({ type: "CONTENT" });
    expect(() => registry.setFallback({ type: "CONTENT" })).toThrow(
      "Only one fallback rule is allowed, and this one already exists: CONTENT",
    );
    expect(registry.fallbackRule).toEqual({ type: "CONTENT" });
  });

  it("adds match rules", () => {
    const registry = new RuleCollectionImpl();
    registry.add({ type: "OPEN", match: "{{" });
    registry.add({ type: "CLOSE", match: "}}" });
    expect(registry.matchRules).toEqual([
      { type: "OPEN", match: "{{" },
      { type: "CLOSE", match: "}}" },
    ]);
  });
});
