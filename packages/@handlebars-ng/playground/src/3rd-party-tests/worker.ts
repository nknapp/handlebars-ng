addEventListener("message", (message) => {
  if (message.data === "ping") postMessage("pong");
});
