import { captureUncaughtErrors } from "./captureUncaughtErrors";

describe("captureUncaughtErrors", () => {
  it("returns nothing if no errors are thrown", async () => {
    const errors = await captureUncaughtErrors(async () => {
      /* noop */
    });
    expect(errors).toHaveLength(0);
  });

  it("returns errors that have not been caught during execution", async () => {
    const errors = await captureUncaughtErrors(async () => {
      window.dispatchEvent(
        new ErrorEvent("error", { error: new Error("Test-Error") }),
      );
    });
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toEqual("Test-Error");
  });

  it("stops capturing after callback is done", async () => {
    const errors = await captureUncaughtErrors(async () => {
      /* noop */
    });
    await captureUncaughtErrors(async () => {
      window.dispatchEvent(
        new ErrorEvent("error", { error: new Error("Test-Error") }),
      );
    });

    expect(errors).toHaveLength(0);
  });
});
