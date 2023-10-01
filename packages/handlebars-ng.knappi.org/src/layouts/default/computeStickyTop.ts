import { clamp } from "@/utils/clamp";

type MyBounds = Pick<DOMRect, "top" | "height">;

export function computeStickyTop(
  scrollingDown: boolean,
  container: MyBounds,
  sticky: MyBounds,
  viewportHeight: number,
): number {
  // all y-positions are relative to container
  const viewportY = -container.top;
  const stickyY = sticky.top - container.top;
  const stickyBottomY = stickyY + sticky.height;

  if (scrollingDown) {
    if (stickyBottomY > viewportY + viewportHeight) return stickyY;
    const wantedY = Math.min(
      viewportY + viewportHeight - sticky.height,
      viewportY,
    );
    return clamp(0, wantedY, container.height - sticky.height);
  } else {
    if (stickyY < viewportY) return stickyY;
    return clamp(0, viewportY, container.height - sticky.height);
  }
}
