export function clamp(min: number, wanted: number, max: number): number {
  if (wanted < min) return min;
  if (wanted > max) return max;
  return wanted;
}
