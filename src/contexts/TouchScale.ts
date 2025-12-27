import { TouchEvent } from "react";

export function useTouchScale(scale = 0.98, duration = 100) {
    const handleTouchStart = (e: TouchEvent<HTMLElement>) => {
        const target = e.currentTarget as HTMLElement;
        target.style.transform = 'scale(0.98)';
        target.style.transition = 'transform 0.1s ease';
    };

    const handleTouchEnd = (e: TouchEvent<HTMLElement>) => {
        const target = e.currentTarget as HTMLElement;
        target.style.transform = 'scale(1)';
    };

    return {
        onTouchStart: handleTouchStart,
        onTouchEnd: handleTouchEnd,
    };
}
