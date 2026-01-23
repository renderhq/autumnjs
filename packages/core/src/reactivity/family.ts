import { atom, Atom, AtomOptions } from './atom.js';

export function atomFamily<Param, Value>(
    create: (param: Param) => Value,
    options: AtomOptions<Value> = {}
): (param: Param) => Atom<Value> {
    const cache = new Map<Param, Atom<Value>>();

    return (param: Param) => {
        if (!cache.has(param)) {
            cache.set(param, atom(create(param), options));
        }
        return cache.get(param)!;
    };
}
