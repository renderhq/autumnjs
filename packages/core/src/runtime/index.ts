export { Engine } from './engine.js';
export { mount, render, unmount, hydrate, setRenderer, getRenderer, plugin } from './api.js';

import { Engine } from './engine.js';
import { mount, render, unmount, hydrate, setRenderer, getRenderer, plugin } from './api.js';


export const runtime = {
    Engine,
    mount,
    render,
    unmount,
    hydrate,
    setRenderer,
    getRenderer,
    plugin
};
