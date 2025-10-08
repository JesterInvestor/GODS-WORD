import { useEffect, useRef, useState } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeOptions {
  minSwipeDistance?: number;
  maxSwipeTime?: number;
}

export function useSwipe(handlers: SwipeHandlers, options: SwipeOptions = {}) {
  const { minSwipeDistance = 50, maxSwipeTime = 300 } = options;
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      setTouchStart({
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      });
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.x;
      const deltaY = touch.clientY - touchStart.y;
      const deltaTime = Date.now() - touchStart.time;

      // Only process if swipe was quick enough
      if (deltaTime > maxSwipeTime) {
        setTouchStart(null);
        return;
      }

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Horizontal swipe (more horizontal than vertical)
      if (absX > absY && absX > minSwipeDistance) {
        if (deltaX > 0) {
          handlers.onSwipeRight?.();
        } else {
          handlers.onSwipeLeft?.();
        }
      }
      // Vertical swipe (more vertical than horizontal)
      else if (absY > absX && absY > minSwipeDistance) {
        if (deltaY > 0) {
          handlers.onSwipeDown?.();
        } else {
          handlers.onSwipeUp?.();
        }
      }

      setTouchStart(null);
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [touchStart, handlers, minSwipeDistance, maxSwipeTime]);

  return elementRef;
}
