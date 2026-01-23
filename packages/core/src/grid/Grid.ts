import { atom, reaction } from '../reactivity/index.js';
import { getVisibleRows } from './virtualizer.js';

export interface GridOptions {
    rowHeight: number;
    overscan?: number;
}

export class Grid {
    public scrollTop = atom(0);
    public viewportHeight = atom(0);
    public rowCount = atom(0);

    constructor(public container: HTMLElement, public options: GridOptions) {
        this.setupListeners();
    }

    private setupListeners() {
        this.container.addEventListener('scroll', (e: any) => {
            this.scrollTop.set(e.target.scrollTop);
        });

        const ro = new ResizeObserver(entries => {
            for (const entry of entries) {
                this.viewportHeight.set(entry.contentRect.height);
            }
        });
        ro.observe(this.container);
    }

    get visibleState() {
        return getVisibleRows(
            this.scrollTop.value,
            this.viewportHeight.value || 800,
            this.options.rowHeight,
            this.rowCount.value,
            this.options.overscan || 20
        );
    }
}
