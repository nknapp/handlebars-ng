export async function captureUncaughtErrors(
  callback: () => Promise<void>,
): Promise<Error[]> {
  const uncaughtErrors: Error[] = [];
  const errorHandler = (event: ErrorEvent) => {
    uncaughtErrors.push(event.error);
  };
  window.addEventListener("error", errorHandler);
  try {
    await callback();
  } finally {
    window.removeEventListener("error", errorHandler);
  }

  return uncaughtErrors;
}
