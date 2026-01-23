import { RendererAdapter, RendererType } from '../renderers/types.js';
import { solidAdapter } from '../renderers/solid.js';
import { preactAdapter } from '../renderers/preact.js';
import { globalDispatcher } from '../engine/dispatcher.js';

let CURRENT_RENDERER: RendererAdapter = solidAdapter;

export class Engine {
    private static dispatcher = globalDispatcher;
    private static phase: 'idle' | 'init' | 'mounted' = 'idle';

    static setRenderer(type: RendererType) {
        if (this.phase !== 'idle') return;
        CURRENT_RENDERER = type === 'preact' ? preactAdapter : solidAdapter;
    }

    static getRenderer(): RendererAdapter {
        return CURRENT_RENDERER;
    }

    static mount(node: () => any, el: HTMLElement) {
        if (this.phase === 'idle') {
            this.phase = 'init';
            this.dispatcher.emit('engine:init', { renderer: CURRENT_RENDERER.name });
            this.dispatcher.install(this);
        }

        try {
            CURRENT_RENDERER.render(node, el);
            this.phase = 'mounted';
            this.dispatcher.emit('engine:mounted', { target: el });
        } catch (e) {
            this.dispatcher.emit('engine:error', e);
        }
    }

    static hydrate(node: () => any, el: HTMLElement) {
        CURRENT_RENDERER.hydrate(node, el);
    }

    static unmount(el: HTMLElement) {
        CURRENT_RENDERER.unmount(el);
        this.dispatcher.emit('engine:unmount', { target: el });
    }

    static plugin(p: (e: typeof Engine) => void) {
        this.dispatcher.use(p);
    }
}
