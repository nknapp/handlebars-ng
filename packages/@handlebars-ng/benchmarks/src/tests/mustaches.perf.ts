import { PerformanceTest } from "../types/types";

export default {
  template:
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr\n ".repeat(20) +
    "{{a1}}" +
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr\n".repeat(20) +
    "{{a2}}" +
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr\n".repeat(20) +
    "{{a3}}" +
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr\n".repeat(20) +
    "{{a4}}" +
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr\n".repeat(20) +
    "{{a5}}" +
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr\n".repeat(20),
  input: { a1: "Nils", a2: "Test2", a3: "Test3", a4: "Test4", a5: "Test5" },
} satisfies PerformanceTest;
