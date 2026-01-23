import { createSignal, createEffect, onCleanup } from 'solid-js';
import { Atom } from './atom.js';
import { Computed } from './computed.js';

export function debounceAtom<T>(source: Atom<T>, delay: number): Computed<T> {
    const [debounced, setDebounced] = createSignal(source.value);

    let timeoutId: NodeJS.Timeout;
    createEffect(() => {
        const value = source();
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => setDebounced(() => value), delay);
    });

    onCleanup(() => clearTimeout(timeoutId));

    const debouncedFn = (() => debounced()) as Computed<T>;
    Object.defineProperties(debouncedFn, {
        value: { get: () => debounced(), enumerable: true },
        brand: { value: 'autumn-computed', writable: false }
    });

    return debouncedFn;
}

export function throttleAtom<T>(source: Atom<T>, delay: number): Computed<T> {
    const [throttled, setThrottled] = createSignal(source.value);

    let lastRun = 0;
    createEffect(() => {
        const value = source();
        const now = Date.now();

        if (now - lastRun >= delay) {
            setThrottled(() => value);
            lastRun = now;
        }
    });

    const throttledFn = (() => throttled()) as Computed<T>;
    Object.defineProperties(throttledFn, {
        value: { get: () => throttled(), enumerable: true },
        brand: { value: 'autumn-computed', writable: false }
    });

    return throttledFn;
}
