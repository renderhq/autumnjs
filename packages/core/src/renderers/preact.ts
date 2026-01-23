import { h, render, hydrate } from 'preact';
import { RendererAdapter } from './types.js';

export const preactAdapter: RendererAdapter = {
    name: 'preact',
    render(component, container) {
        render(h(component, {}), container);
    },
    hydrate(component, container) {
        hydrate(h(component, {}), container);
    },
    unmount(container) {
        render(null, container);
    },
    createElement(type, props, ...children) {
        return h(type, props, ...children);
    }
};
