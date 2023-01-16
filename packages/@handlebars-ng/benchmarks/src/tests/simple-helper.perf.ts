import { PerformanceTest } from "../types/types";

export default {
  template: (
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr\n " +
    "{{{a1}}}" +
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr\n" +
    "{{{a2}}}" +
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr\n" +
    "{{{a3}}}" +
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr\n" +
    "{{{a4}}}" +
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr\n" +
    "{{{a5}}}" +
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr\n"
  ).repeat(20),
  input: { a1: "Nils", a2: "Test2", a3: "Test3", a4: "Test4", a5: "Test5" },
  helpers: {
    a1: () => "a1",
    a2: () => "a2",
    a3: () => "a3",
    a4: () => "a4",
    a5: () => "a5",
  },
} satisfies PerformanceTest;
