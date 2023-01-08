// Only for testing
export function busyWaitMs(time: number) {
  return () => {
    const end = performance.now() + time;
    while (performance.now() < end) {
      /* busy wait */
    }
  };
}
