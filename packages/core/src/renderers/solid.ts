import { render, hydrate } from 'solid-js/web';
import { createComponent } from 'solid-js';
import { RendererAdapter } from './types.js';

export const solidAdapter: RendererAdapter = {
    name: 'solid',
    render(component, container) {
        render(component, container);
    },
    hydrate(component, container) {
        hydrate(component, container);
    },
    unmount(container) {
        container.innerHTML = '';
    },
    createElement(type, props, ...children) {
        return createComponent(type, { ...props, children });
    }
};
