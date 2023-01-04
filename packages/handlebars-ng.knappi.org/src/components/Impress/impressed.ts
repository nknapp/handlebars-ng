const FONT_SIZE = 15;
const LINE_HEIGHT = FONT_SIZE * 1.2;
const distortedChars =
  "\n.- ☎01📧23456789ABCDEFGHIJKLMOPQRSTUVWXYZÄÖÜßabcdefghijklmnopqrstuvwxyzäöü";
const text =
  "zzzNDA3zb8L669HDH4üzzzßL4DLäYH\uD83DH8DJEäUHFzwwüzzzprtnmziL4932LI2üzyzxwop/ttxtrswtüvuz869@B8L66Dö74F";

export function createImpress(): HTMLCanvasElement {
  return new ImpressFactory(text).canvas;
}

class ImpressFactory {
  readonly canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(text: string) {
    this.canvas = document.createElement("canvas");
    const ctx = this.canvas.getContext("2d");
    if (ctx == null) throw new Error("Canvas context is null");
    this.ctx = ctx;
    this.ctx.font = `${FONT_SIZE}px monospace`;
    this.drawText(distort(text));
  }

  private drawText(text: string): this {
    let y = 0;
    for (const line of text.split("\n")) {
      this.ctx.fillText(line, 0, (y += LINE_HEIGHT));
    }

    return this;
  }
}

function distort(text: string): string {
  return text.split("").map(distortChar).join("");
}

function distortChar(char: string): string {
  const index = distortedChars.indexOf(char);
  if (index >= 0)
    return distortedChars[distortedChars.length - index - 1] || char;
  return char;
}
