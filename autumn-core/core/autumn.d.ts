import * as React from "react";

export interface AutumnSignalReturn<T> {
  get: () => T;
  set: (v: T) => void;
}

export function AutumnSignal<T>(initial: T): AutumnSignalReturn<T>;
export const useAutumnSignal: <T>(initial: T) => AutumnSignalReturn<T>;

export function AutumnEffect(fn: () => void, deps?: React.DependencyList): void;
export function AutumnComputed<T>(fn: () => T, deps?: React.DependencyList): T;

export function AutumnContext<T>(defaultValue: T): React.Context<T>;
export function useAutumnCtx<T>(ctx: React.Context<T>): T;

export function AutumnComponent<P = {}>(
  Comp: React.ComponentType<P>
): React.ComponentType<P>;
