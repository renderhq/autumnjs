import { Atom } from './atom.js';
import { Computed, computed } from './computed.js';

export function selector<T, R>(
    source: Atom<T> | Computed<T>,
    select: (val: T) => R,
    equals?: (prev: R, next: R) => boolean
): Computed<R> {
    return computed(() => select(source()), equals);
}
