import { showSidebar, toggleSidebar } from "@/layouts/default/sidebar-store";
import { useStore } from "@nanostores/solid";
import { Component, JSXElement, onCleanup, onMount } from "solid-js";

export const Sidebar: Component<{ children?: JSXElement }> = (props) => {
  const aside = "w-64 p-4 bg-orange-100 transition h-full drop-shadow-lg lg:filter-none";
  const translateLeft = "transform -translate-x-64 duration-300 lg:translate-x-0";


  const detector = new SwipeDetector((direction) => showSidebar.set(direction === "right"))

  onMount(() => detector.install())
  onCleanup(() => detector.uninstall())

  const show = useStore(showSidebar);

  return (
    <aside
      class={aside + " " + (show() ? "" : translateLeft)}
      onClick={toggleSidebar}
    >
      {props.children}
    </aside>
  );
};




abstract class TouchHandler {

  constructor() {
    this.start = this.start.bind(this)
    this.move = this.move.bind(this)
    this.end = this.end.bind(this)
  }

  install() {
    window.addEventListener("touchstart", this.start)
    window.addEventListener("touchmove", this.move)
    window.addEventListener("touchend", this.end)
  }

  uninstall() {
    window.removeEventListener("touchstart", this.start)
    window.removeEventListener("touchmove", this.move)
    window.removeEventListener("touchend", this.end)
  }

  abstract start(event: TouchEvent): void;
  abstract move(event: TouchEvent): void;
  abstract end(event: TouchEvent): void;
}

interface Point {
  x: number;
  y: number;
}

type Direction = "left" | "right"

class SwipeDetector extends TouchHandler{

  startPos: Point | null = null
  onSwipe: (dir: Direction) => void

  constructor(onSwipe: (dir: Direction) => void) {
    super()
    this.onSwipe = onSwipe
  }

  start(event: TouchEvent): void {
    this.startPos = this.posFromEvent(event)
  }

  move(event: TouchEvent): void {
    const newPos = this.posFromEvent(event)
    if (newPos != null && this.startPos != null) {
      const yDiff = Math.abs(this.startPos.y - newPos.y)
      const xDiff = newPos.x - this.startPos.x
      if (yDiff > 100) {
        this.cancel()
      } else if (xDiff > window.innerWidth / 2) {
        this.onSwipe("right")
        this.cancel()
      } else if (xDiff < -window.innerWidth / 2) {
        this.onSwipe("left")
        this.cancel()
      }
    }
  }
  end(): void {
    this.cancel()
  }

  private posFromEvent(event: TouchEvent): Point | null {
    const touch = event.touches[0]
    if (touch == null) return null
    return {x: touch.clientX, y: touch.clientY}
  }
      
  private cancel(): void {
    this.startPos = null
  }

}