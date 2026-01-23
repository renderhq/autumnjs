import { createContext, useContext } from 'solid-js';

export const context = <T>(defaultValue?: T) => {
    const ctx = createContext(defaultValue);
    return {
        Provider: ctx.Provider,
        use: () => useContext(ctx)
    };
};

export { createContext, useContext };
