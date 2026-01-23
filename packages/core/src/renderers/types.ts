export interface RendererAdapter {
    name: string;
    render(component: () => any, container: HTMLElement): void;
    hydrate(component: () => any, container: HTMLElement): void;
    unmount(container: HTMLElement): void;
    createElement(type: any, props: any, ...children: any[]): any;
}

export type RendererType = 'solid' | 'preact';
