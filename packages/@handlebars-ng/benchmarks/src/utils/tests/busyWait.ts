// Only for testing
export function busyWaitMs(time: number) {
  return () => {
    const start = performance.now();
    while (performance.now() - start < time) {
      /* busy wait */
    }
  };
}
