import {
    createSignal
} from 'solid-js';

export type AtomOptions<T> = {
    persist?: boolean;
    key?: string;
    validate?: (val: T) => boolean;
    middleware?: (val: T) => T;
    equals?: (prev: T, next: T) => boolean;
};

export type Atom<T> = {
    (): T;
    readonly value: T;
    update(fn: (v: T) => T): void;
    set(v: T): void;
    readonly brand: 'autumn-atom';
};

export function atom<T>(initialValue: T, options: AtomOptions<T> = {}): Atom<T> {
    const internalInitial = options.persist && options.key
        ? (JSON.parse(localStorage.getItem(options.key) || 'null') ?? initialValue)
        : initialValue;

    const [get, set] = createSignal(internalInitial, {
        equals: options.equals || ((a, b) => a === b)
    });

    const fn = (() => get()) as Atom<T>;

    const setter = (next: T) => {
        let value = next;
        if (options.middleware) value = options.middleware(value);
        if (options.validate && !options.validate(value)) return;
        if (options.persist && options.key) {
            try {
                localStorage.setItem(options.key, JSON.stringify(value));
            } catch (e) {
                console.warn('[Autumn] Failed to persist atom:', e);
            }
        }
        set(() => value);
    };

    Object.defineProperties(fn, {
        value: { get: () => get(), enumerable: true },
        update: { value: (updater: (v: T) => T) => setter(updater(get())), writable: false },
        set: { value: (v: T) => setter(v), writable: false },
        brand: { value: 'autumn-atom', writable: false }
    });

    return fn;
}
