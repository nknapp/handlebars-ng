import { showSidebar } from "@/layouts/default/sidebar-store";
import { useStore } from "@nanostores/solid";
import {
  Component,
  createEffect,
  JSXElement,
  onCleanup,
  onMount,
} from "solid-js";
import { ClickOutSide } from "./ClickOutside";
import { SwipeDetector } from "./SwipeDetector";

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

  const show = useStore(showSidebar);

  if (typeof window === "object") {
    onMount(() => {
      detector.install();
    });
    onCleanup(() => {
      detector.uninstall();
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
    <aside
      ref={clickOutSide.setElement}
      class={aside + " " + (show() ? "" : translateLeft)}
    >
      {props.children}
    </aside>
  );
};
