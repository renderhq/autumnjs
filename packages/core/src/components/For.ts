import { For as SolidFor, Index as SolidIndex } from 'solid-js';
import type { JSX } from 'solid-js';

export const For = SolidFor;
export const AutumnFor = SolidFor;

export const Index = SolidIndex;
export const AutumnIndex = SolidIndex;

export type ForProps<T, U extends JSX.Element> = {
    each: readonly T[] | undefined | null | false;
    fallback?: JSX.Element;
    children: (item: T, index: () => number) => U;
};

export type IndexProps<T, U extends JSX.Element> = {
    each: readonly T[] | undefined | null | false;
    fallback?: JSX.Element;
    children: (item: () => T, index: number) => U;
};
