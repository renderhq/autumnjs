import { 
  AutumnSignalHook, 
  AutumnEffectHook, 
  AutumnComputedHook,
  AutumnContextHook,
  useAutumnContext
} from "./internals";

// Signal implementation
export function AutumnSignal(initial) {
  const [value, setValue] = AutumnSignalHook(initial);
  return {
    get: () => value,
    set: setValue
  };
}

export const useAutumnSignal = AutumnSignal;

// Effect implementation
export function AutumnEffect(fn, deps) {
  return AutumnEffectHook(fn, deps);
}

// Computed value implementation
export function AutumnComputed(fn, deps) {
  return AutumnComputedHook(fn, deps);
}

// Context implementation
export function AutumnContext(defaultValue) {
  return AutumnContextHook(defaultValue);
}

export function useAutumnCtx(ctx) {
  return useAutumnContext(ctx);
}

// Component wrapper
export function AutumnComponent(Comp) {
  return Comp;
}

export {
  AutumnSignalHook,
  AutumnEffectHook,
  AutumnComputedHook,
  AutumnContextHook,
  useAutumnContext
};
