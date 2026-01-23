import { Switch as SolidSwitch, Match as SolidMatch } from 'solid-js';
import type { JSX } from 'solid-js';

export const Switch = SolidSwitch;
export const AutumnSwitch = SolidSwitch;

export const Match = SolidMatch;
export const AutumnMatch = SolidMatch;

export type SwitchProps = {
    fallback?: JSX.Element;
    children: JSX.Element;
};

export type MatchProps<T> = {
    when: T | undefined | null | false;
    children: JSX.Element | ((item: NonNullable<T>) => JSX.Element);
};
