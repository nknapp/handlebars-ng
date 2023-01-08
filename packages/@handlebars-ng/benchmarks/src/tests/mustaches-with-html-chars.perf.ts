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
    a1: "Nil<s Knapp<meier",
    a2: "Tes>t2",
    a3: "Tes=t3",
    a4: 'Tes"t4',
    a5: "Test'5",
  },
} satisfies PerformanceTest;
