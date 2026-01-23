import { untrack, batch } from 'solid-js';

export function silent<T>(fn: () => T): T {
    return untrack(fn);
}

export function transaction<T>(fn: () => T): T {
    return batch(fn);
}
