import { showSidebar } from "@/layouts/default/sidebar-store";
import { useStore } from "@nanostores/solid";
import {
  Component,
  createEffect,
  createSignal,
  Accessor,
  JSXElement,
  onCleanup,
  onMount,
} from "solid-js";
import { ClickOutSide } from "./ClickOutside";
import { SwipeDetector } from "./SwipeDetector";
import { computeStickyTop } from "@/layouts/default/computeStickyTop";

export const Sidebar: Component<{ children?: JSXElement }> = (props) => {
  const aside =
    "w-64 p-4 bg-orange-100 transition shadow-lg lg:shadow-none rounded-r-3xl mt-4";
  const translateLeft =
    "transform -translate-x-64 duration-300 lg:translate-x-0";

  const [containerElement, setContainerElement] = createSignal<HTMLElement>();
  const [stickyElement, setStickyElement] = createSignal<HTMLElement>();

  keepSticky(stickyElement, containerElement);

  const swipeDetector = new SwipeDetector((direction) => {
    switch (direction) {
      case "right":
        showSidebar.set(true);
        return;
      case "left":
        showSidebar.set(false);
        return;
    }
  });
  const clickOutSide = new ClickOutSide((event) => {
    event.preventDefault();
    event.stopPropagation();
    showSidebar.set(false);
  });

  const show = useStore(showSidebar);

  if (typeof window === "object") {
    onMount(() => {
      swipeDetector.install();
    });
    onCleanup(() => {
      swipeDetector.uninstall();
    });

    createEffect(() => {
      if (show()) {
        clickOutSide.install();
      } else {
        clickOutSide.uninstall();
      }
    });
  }

  return (
    <div ref={setContainerElement} class="h-full relative">
      <div ref={setStickyElement} class="absolute">
        <aside
          ref={clickOutSide.setElement}
          class={aside + " " + (show() ? "" : translateLeft)}
        >
          {props.children}
        </aside>
      </div>
    </div>
  );
};

function keepSticky(
  stickyElement: Accessor<HTMLElement | undefined>,
  containerElement: Accessor<HTMLElement | undefined>
) {
  if (typeof window === "undefined") return;
  let lastScrollY = window.scrollY + 20;

  function adjustHeight() {
    const sticky = stickyElement();
    const container = containerElement();
    if (sticky == null || container == null) return;
    const { height } = sticky.getBoundingClientRect();
    container.style.minHeight = height + "px";
  }

  function adjustInitialYPosition() {
    const sticky = stickyElement();
    const container = containerElement();
    if (sticky == null || container == null) return;
    const containerBounds = container.getBoundingClientRect();
    sticky.style.top = -containerBounds.top + "px";
  }

  function adjustYPosition() {
    const sticky = stickyElement();
    const container = containerElement();

    if (sticky == null || container == null) return;
    const stickyBounds = sticky.getBoundingClientRect();
    const containerBounds = container.getBoundingClientRect();
    const scrollingDown = lastScrollY < window.scrollY;
    const newTop = computeStickyTop(
      scrollingDown,
      containerBounds,
      stickyBounds,
      window.innerHeight
    );
    sticky.style.top = newTop + "px";
    lastScrollY = window.scrollY;
  }

  let lastRaf: number | null = null;

  function rafAdjustPosition() {
    if (lastRaf != null) cancelAnimationFrame(lastRaf);
    lastRaf = requestAnimationFrame(adjustYPosition);
  }

  onMount(() => {
    window.addEventListener("scroll", rafAdjustPosition);
    adjustHeight();
    adjustInitialYPosition();
  });

  onCleanup(() => {
    window.removeEventListener("scroll", rafAdjustPosition);
  });
}
