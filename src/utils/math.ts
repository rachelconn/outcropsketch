export function clamp(val: number, minVal: number, maxVal: number): number {
  return Math.max(Math.min(maxVal, val), minVal);
}
