import { Engine } from './engine.js';

export const mount = (node: () => any, el: HTMLElement) => Engine.mount(node, el);
export const render = mount;
export const unmount = (el: HTMLElement) => Engine.unmount(el);
export const hydrate = (node: () => any, el: HTMLElement) => Engine.hydrate(node, el);
export const setRenderer = (type: 'solid' | 'preact') => Engine.setRenderer(type);
export const getRenderer = () => Engine.getRenderer();
export const plugin = (p: (e: typeof Engine) => void) => Engine.plugin(p);
