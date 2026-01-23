import { createResource } from 'solid-js';

export type AsyncAtom<T> = {
    (): T | undefined;
    readonly value: T | undefined;
    readonly loading: boolean;
    readonly error: any;
    refetch(): void;
    readonly brand: 'autumn-async';
};

export function asyncAtom<T>(
    fetcher: () => Promise<T>,
    options: { initialValue?: T } = {}
): AsyncAtom<T> {
    const [data, { refetch }] = createResource(fetcher, {
        initialValue: options.initialValue
    });

    const asyncFn = (() => data()) as AsyncAtom<T>;

    Object.defineProperties(asyncFn, {
        value: { get: () => data(), enumerable: true },
        loading: { get: () => data.loading, enumerable: true },
        error: { get: () => data.error, enumerable: true },
        refetch: { value: refetch, writable: false },
        brand: { value: 'autumn-async', writable: false }
    });

    return asyncFn;
}
