declare global {
  interface Window {
    global: typeof globalThis;
  }
}

if (typeof self === "object") {
  // ts-ignore
  self.global = self;
}

export {};
