import MyWorker from "./worker?worker";
import { vi } from "vitest";
import { waitFor } from "@solidjs/testing-library";
test("can use workers in test", async () => {
  const worker = new MyWorker();
  const callback = vi.fn();
  worker.addEventListener("message", callback);
  worker.postMessage("ping");

  await waitFor(() => {
    expect(callback).toHaveBeenCalled();
  });
});
