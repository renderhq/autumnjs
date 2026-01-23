import { createStore, produce } from 'solid-js/store';

export function slice<T extends object>(initial: T) {
    const [state, setState] = createStore(initial);

    const proxy = new Proxy(state, {
        get(target, prop, receiver) {
            return Reflect.get(target, prop, receiver);
        },
        set(target, prop, value) {
            if (typeof value === 'function') {
                setState(prop as any, produce(value));
            } else {
                setState(prop as any, value);
            }
            return true;
        }
    });

    return proxy;
}
