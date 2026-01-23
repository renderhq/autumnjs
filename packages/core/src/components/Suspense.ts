import { Suspense as SolidSuspense, ErrorBoundary as SolidErrorBoundary } from 'solid-js';

export const Suspense = SolidSuspense;
export const AutumnSuspense = SolidSuspense;

export const ErrorBoundary = SolidErrorBoundary;
export const AutumnErrorBoundary = SolidErrorBoundary;

import type { JSX } from 'solid-js';

export type SuspenseProps = {
    fallback?: JSX.Element;
    children: JSX.Element;
};

export type ErrorBoundaryProps = {
    fallback: (err: Error, reset: () => void) => JSX.Element;
    children: JSX.Element;
};
