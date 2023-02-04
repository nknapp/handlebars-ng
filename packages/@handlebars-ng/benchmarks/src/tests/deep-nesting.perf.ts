import { PerformanceTest } from "../types/types";

export default {
  template: (
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr\n " +
    "{{a1.a2.a3.a4.a5.a6.a7}}"
  ).repeat(100),
  input: {
    a1: {
      a2: {
        a3: {
          a4: {
            a5: {
              a6: {
                a7: "Hello",
              },
            },
          },
        },
      },
    },
  },
} satisfies PerformanceTest;
