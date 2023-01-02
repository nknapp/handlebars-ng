import { PerformanceTest } from "../types/types";

export default {
  template:
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr\n ".repeat(20) +
    "{{name}}" +
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr\n".repeat(20),
  input: { name: "Nils" },
} satisfies PerformanceTest;
