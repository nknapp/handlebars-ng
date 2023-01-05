const MIN_SWIPE_DISTANCE = 100;

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

export class SwipeDetector extends TouchHandler {
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
      const direction = this.getSwipeDirection(this.startPos, newPos);
      if (direction != null) {
        this.onSwipe(direction);
        this.startPos = this.posFromEvent(event);
      }
    }
  }

  private posFromEvent(event: TouchEvent): Point | null {
    const touch = event.touches[0];
    if (touch == null) return null;
    return { x: touch.clientX, y: touch.clientY };
  }

  private getSwipeDirection(startPos: Point, newPos: Point): Direction | null {
    const yDiff = newPos.y - startPos.y;
    const xDiff = newPos.x - startPos.x;
    if (xDiff > MIN_SWIPE_DISTANCE) {
      return "right";
    } else if (xDiff < -MIN_SWIPE_DISTANCE) {
      return "left";
    } else if (yDiff > MIN_SWIPE_DISTANCE) {
      return "up";
    } else if (yDiff < -MIN_SWIPE_DISTANCE) {
      return "down";
    } else {
      return null;
    }
  }

  end(): void {
    this.cancel();
  }

  private cancel(): void {
    this.startPos = null;
  }
}
