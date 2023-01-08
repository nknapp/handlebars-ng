import { PerformanceTest } from "../types/types";

export default {
  template: (
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr\n " +
    "{{a1}}" +
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr\n" +
    "{{a2}}" +
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr\n" +
    "{{a3}}" +
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr\n" +
    "{{a4}}" +
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr\n" +
    "{{a5}}" +
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr\n"
  ).repeat(20),
  input: {
    a1: "Nils Knappmeier",
    a2: "Test2",
    a3: "Test3",
    a4: "Test4",
    a5: "Test5",
  },
} satisfies PerformanceTest;
