export type Plugin = (engine: any) => void;
export type Hook = (data: any) => void;


export class Dispatcher {
    private plugins: Plugin[] = [];
    private hooks: Map<string, Set<Hook>> = new Map();

    use(plugin: Plugin) {
        this.plugins.push(plugin);
    }

    install(engine: any) {
        const len = this.plugins.length;
        for (let i = 0; i < len; i++) {
            try {
                this.plugins[i](engine);
            } catch (e) {
                console.error('[Autumn Plugin Error]', e);
            }
        }
    }

    on(event: string, hook: Hook) {
        let hookSet = this.hooks.get(event);
        if (!hookSet) {
            hookSet = new Set();
            this.hooks.set(event, hookSet);
        }
        hookSet.add(hook);
    }

    off(event: string, hook: Hook) {
        const hookSet = this.hooks.get(event);
        if (hookSet) {
            hookSet.delete(hook);
            if (hookSet.size === 0) {
                this.hooks.delete(event);
            }
        }
    }

    emit(event: string, data: any) {
        const hookSet = this.hooks.get(event);
        if (!hookSet || hookSet.size === 0) return;

        for (const hook of hookSet) {
            hook(data);
        }
    }

    clear(event?: string) {
        if (event) {
            this.hooks.delete(event);
        } else {
            this.hooks.clear();
        }
    }
}

export const globalDispatcher = new Dispatcher();
