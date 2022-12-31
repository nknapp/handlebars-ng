// store/users.ts
import { atom } from "nanostores";

export const showSidebar = atom<boolean>(false);

export function toggleSidebar() {
  showSidebar.set(!showSidebar.get());
}
