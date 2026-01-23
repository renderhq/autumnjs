import { Engine } from './runtime/index.js';

// Cache renderer to avoid repeated lookups
let cachedRenderer: ReturnType<typeof Engine.getRenderer> | null = null;

const getRenderer = () => {
    if (!cachedRenderer) {
        cachedRenderer = Engine.getRenderer();
    }
    return cachedRenderer;
};

export function jsx(type: any, props: any, key?: any) {
    const adapter = getRenderer();

    if (key === undefined) {
        return adapter.createElement(type, props);
    }

    // Only clone when we need to add key
    const normalizedProps = { ...props, key };
    return adapter.createElement(type, normalizedProps);
}

export { jsx as jsxs };

export const Fragment = (props: any) => props.children;

export namespace JSX {
    export interface IntrinsicElements {
        [elem: string]: any;
    }
    export interface Element {
        [key: string]: any;
    }
    export interface ElementAttributesProperty {
        props: {};
    }
    export interface ElementChildrenAttribute {
        children: {};
    }
}
