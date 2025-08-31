import { 
  AutumnSignalHook, 
  AutumnEffectHook, 
  AutumnComputedHook,
  AutumnContextHook,
  useAutumnContext
} from "./internals";

// Signal implementation
export function createAutumnSignal(initial) {
  return function useAutumnSignal() {
    const [value, setValue] = AutumnSignalHook(initial);
    return {
      get: () => value,
      set: setValue
    };
  };
}

export function AutumnSignal(initial) {
  const signal = createAutumnSignal(initial)();
  return signal;
}

export function useAutumnSignal(initial) {
  return createAutumnSignal(initial)();
}

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
export function AutumnComponent(component) {
  // If it's a class component, return it as is
  if (typeof component === 'function' && component.prototype && component.prototype.isReactComponent) {
    return component;
  }

  // Create a proper React function component
  function WrappedComponent(props) {
    // Call the component function with props and ensure it returns a valid React element
    const result = component(props);
    
    // If the result is already a valid React element, return it
    if (result && typeof result === 'object' && '$$typeof' in result) {
      return result;
    }
    
    // If the result is a function, it might be a component
    if (typeof result === 'function') {
      const Element = result;
      return <Element {...props} />;
    }
    
    // If we get here, return null or the result as a fallback
    return result || null;
  }
  
  // Copy static properties
  if (typeof component === 'function') {
    Object.assign(WrappedComponent, component);
  }
  
  // Set display name for better debugging
  WrappedComponent.displayName = `AutumnComponent(${
    component.displayName || component.name || 'Component'
  })`;
  
  return WrappedComponent;
}
export {
  AutumnSignalHook,
  AutumnEffectHook,
  AutumnComputedHook,
  AutumnContextHook,
  useAutumnContext
};
