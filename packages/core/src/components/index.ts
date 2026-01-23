// Control flow components
export { Show, AutumnShow, type ShowProps } from './Show.js';
export { For, Index, AutumnFor, AutumnIndex, type ForProps, type IndexProps } from './For.js';
export { Switch, Match, AutumnSwitch, AutumnMatch, type SwitchProps, type MatchProps } from './Switch.js';

// Async components
export { Suspense, ErrorBoundary, AutumnSuspense, AutumnErrorBoundary, type SuspenseProps, type ErrorBoundaryProps } from './Suspense.js';

import { Show, AutumnShow } from './Show.js';
import { For, Index, AutumnFor, AutumnIndex } from './For.js';
import { Switch, Match, AutumnSwitch, AutumnMatch } from './Switch.js';
import { Suspense, ErrorBoundary, AutumnSuspense, AutumnErrorBoundary } from './Suspense.js';

export const components = {
    Show,
    AutumnShow,
    For,
    Index,
    AutumnFor,
    AutumnIndex,
    Switch,
    Match,
    AutumnSwitch,
    AutumnMatch,
    Suspense,
    ErrorBoundary,
    AutumnSuspense,
    AutumnErrorBoundary
};
