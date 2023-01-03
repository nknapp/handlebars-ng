import { showSidebar } from "@/layouts/default/sidebar-store";
import { useStore } from "@nanostores/solid";
import {
  Component,
  createEffect,
  JSXElement,
  onCleanup,
  onMount,
} from "solid-js";

export const Sidebar: Component<{ children?: JSXElement }> = (props) => {
  const aside =
    "w-64 p-4 bg-orange-100 transition shadow-lg lg:shadow-none sticky top-4 rounded-r-3xl mt-4";
  const translateLeft =
    "transform -translate-x-64 duration-300 lg:translate-x-0";

  const detector = new SwipeDetector((direction) => {
    showSidebar.set(direction === "right");
  });
  const clickOutSide = new ClickOutSide((event) => {
    event.preventDefault();
    event.stopPropagation();
    showSidebar.set(false);
  });

  onMount(() => {
    detector.install();
  });
  onCleanup(() => {
    detector.uninstall();
  });

  const show = useStore(showSidebar);

  createEffect(() => {
    if (show()) {
      clickOutSide.install();
    } else {
      clickOutSide.uninstall();
    }
  });

  return (
    <aside
      ref={clickOutSide.setElement}
      class={aside + " " + (show() ? "" : translateLeft)}
    >
      {props.children}
    </aside>
  );
};

abstract class TouchHandler {
  constructor() {
    this.start = this.start.bind(this);
    this.move = this.move.bind(this);
    this.end = this.end.bind(this);
  }

  install() {
    window.addEventListener("touchstart", this.start);
    window.addEventListener("touchmove", this.move);
    window.addEventListener("touchend", this.end);
  }

  uninstall() {
    window.removeEventListener("touchstart", this.start);
    window.removeEventListener("touchmove", this.move);
    window.removeEventListener("touchend", this.end);
  }

  abstract start(event: TouchEvent): void;
  abstract move(event: TouchEvent): void;
  abstract end(event: TouchEvent): void;
}

interface Point {
  x: number;
  y: number;
}

type Direction = "left" | "right" | "down" | "up";

class SwipeDetector extends TouchHandler {
  startPos: Point | null = null;
  threshold = 100;
  onSwipe: (dir: Direction) => void;

  constructor(onSwipe: (dir: Direction) => void) {
    super();
    this.onSwipe = onSwipe;
  }

  start(event: TouchEvent): void {
    this.startPos = this.posFromEvent(event);
  }

  move(event: TouchEvent): void {
    const newPos = this.posFromEvent(event);
    if (newPos != null && this.startPos != null) {
      const yDiff = newPos.y - this.startPos.y;
      const xDiff = newPos.x - this.startPos.x;
      if (xDiff > 200) {
        this.swipeDetected("right", event);
      } else if (xDiff < -200) {
        this.swipeDetected("left", event);
      } else if (yDiff > 200) {
        this.swipeDetected("up", event);
      } else if (yDiff < -200) {
        this.swipeDetected("down", event);
      }
    }
  }

  swipeDetected(dir: Direction, event: TouchEvent): void {
    this.onSwipe(dir);
    this.startPos = this.posFromEvent(event);
  }

  end(): void {
    this.cancel();
  }

  private posFromEvent(event: TouchEvent): Point | null {
    const touch = event.touches[0];
    if (touch == null) return null;
    return { x: touch.clientX, y: touch.clientY };
  }

  private cancel(): void {
    this.startPos = null;
  }
}

class ClickOutSide {
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
