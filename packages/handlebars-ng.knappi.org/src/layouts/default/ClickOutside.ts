export class ClickOutSide {
  private element: HTMLElement | null = null;
  private onClickOutSide: (event: MouseEvent) => void;

  constructor(onClickOutside: (event: MouseEvent) => void) {
    this.setElement = this.setElement.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.onClickOutSide = onClickOutside;
  }

  setElement(element: HTMLElement): void {
    this.element = element;
  }

  handleClick(event: MouseEvent) {
    const rect = this.element?.getBoundingClientRect();
    if (rect == null) return;
    if (this.isInside(event.clientX, event.clientY, rect)) {
      return;
    }
    this.onClickOutSide(event);
  }

  private isInside(x: number, y: number, rect: DOMRect): boolean {
    return (
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    );
  }

  install(): void {
    window.addEventListener("click", this.handleClick, { capture: true });
  }

  uninstall(): void {
    window.removeEventListener("click", this.handleClick, { capture: true });
  }
}
