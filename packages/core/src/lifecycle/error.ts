import { onError } from 'solid-js';

export const autumnOnError = onError;

export { onError };

export type ErrorCallback = (err: Error) => void;
