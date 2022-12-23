import { showSidebar, toggleSidebar } from "@/store/sidebar";
import { useStore } from "@nanostores/solid";
import type { Component, createSignal } from "solid-js";

export const SidebarButton: Component = () => {
  const sideBarVisible = useStore(showSidebar);
  const rotated = "transform rotate-90"
  const baseStyle = "transition duration-300"
  return (
      <button class="border border-1 white block lg:hidden" onClick={toggleSidebar}>
        <svg width="24" height="24" class={baseStyle + " " + (sideBarVisible() ? rotated : "")}>
        <line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" />
        <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" />
        <line x1="4" y1="18" x2="20" y2="18" stroke="currentColor" />
        </svg>
      </button>
  );
};
