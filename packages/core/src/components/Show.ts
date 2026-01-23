import { Show as SolidShow } from 'solid-js';
import type { JSX } from 'solid-js';

export const Show = SolidShow;
export const AutumnShow = SolidShow;

export type ShowProps<T> = {
    when: T | undefined | null | false;
    fallback?: JSX.Element;
    children: JSX.Element | ((item: NonNullable<T>) => JSX.Element);
};
