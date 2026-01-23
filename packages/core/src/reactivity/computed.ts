import { createMemo } from 'solid-js';

export type Computed<T> = {
    (): T;
    readonly value: T;
    readonly brand: 'autumn-computed';
};

export function computed<T>(fn: () => T, equals?: (prev: T, next: T) => boolean): Computed<T> {
    const memo = createMemo(fn, undefined, { equals });
    const computedFn = (() => memo()) as Computed<T>;

    Object.defineProperties(computedFn, {
        value: { get: () => memo(), enumerable: true },
        brand: { value: 'autumn-computed', writable: false }
    });

    return computedFn;
}

export function derived<T>(fn: () => T): Computed<T> {
    return computed(fn);
}
