import { TouchEvent } from "react";

export function useTouchScale(scale = 0.98, duration = 100) {
    const handleTouchStart = (e: TouchEvent<HTMLElement>) => {
        const target = e.currentTarget;
        target.style.transform = `scale(${scale})`;
        target.style.transition = `transform ${duration}ms ease`;
    };

    const handleTouchEnd = (e: TouchEvent<HTMLElement>) => {
        const target = e.currentTarget;
        target.style.transform = "scale(1)";
    };

    return {
        onTouchStart: handleTouchStart,
        onTouchEnd: handleTouchEnd,
    };
}
