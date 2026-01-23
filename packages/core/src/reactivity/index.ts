// Core primitives
export { atom, type Atom, type AtomOptions, atom as signal } from './atom.js';
export { computed, derived, type Computed } from './computed.js';
export { asyncAtom, type AsyncAtom } from './async.js';

// Advanced patterns
export { atomFamily } from './family.js';
export { selector } from './selector.js';

// Effects and reactions
export { reaction, effect, createEffect, watch, createAtomEffect } from './effects.js';

// Timing utilities
export { debounceAtom, throttleAtom } from './timing.js';

// Batch operations
export { silent, transaction } from './batch.js';

import { atom } from './atom.js';
import { computed, derived } from './computed.js';
import { asyncAtom } from './async.js';
import { atomFamily } from './family.js';
import { selector } from './selector.js';
import { reaction, effect, createEffect, watch, createAtomEffect } from './effects.js';
import { debounceAtom, throttleAtom } from './timing.js';
import { silent, transaction } from './batch.js';


// Convenience export
export const reactivity = {
    // Core
    atom,
    signal: atom,
    computed,
    asyncAtom,
    derived,

    // Advanced
    atomFamily,
    selector,

    // Effects
    reaction,
    effect,
    createEffect,
    watch,
    createAtomEffect,

    // Timing
    debounceAtom,
    throttleAtom,

    // Batch
    silent,
    transaction
};
