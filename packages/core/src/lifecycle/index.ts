export { onMount, autumnOnMount, type MountCallback } from './mount.js';
export { onCleanup, autumnOnCleanup, type CleanupCallback } from './cleanup.js';
export { onError, autumnOnError, type ErrorCallback } from './error.js';

import { onMount } from './mount.js';
import { onCleanup } from './cleanup.js';
import { onError } from './error.js';

export const lifecycle = {
    onMount,
    onCleanup,
    onError
};
