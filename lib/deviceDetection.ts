// Device detection utility
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error - for older browsers with msMaxTouchPoints
    (navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 0)
  );
}

export function isDesktop(): boolean {
  return !isTouchDevice();
}
