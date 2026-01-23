import { createEffect as solidCreateEffect } from 'solid-js';
import { Atom } from './atom.js';
import { Computed } from './computed.js';

export function reaction(fn: () => void | (() => void)) {
    return solidCreateEffect(() => {
        const cleanup = fn();
        return cleanup;
    });
}

export const effect = reaction;
export const createEffect = reaction;

export function watch<T>(
    source: Atom<T> | Computed<T> | (() => T),
    callback: (value: T, prev: T | undefined) => void,
    options: { immediate?: boolean } = {}
) {
    let prev: T | undefined;

    const autumnEffect = solidCreateEffect(() => {
        const current = source();
        if (options.immediate || prev !== undefined) {
            callback(current, prev);
        }
        prev = current;
    });

    return autumnEffect;
}

export function createAtomEffect<T>(
    source: Atom<T>,
    effect: (value: T) => void | (() => void)
) {
    return reaction(() => {
        const value = source();
        return effect(value);
    });
}
