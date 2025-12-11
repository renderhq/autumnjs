let CURRENT_EFFECT = null;
let BATCH_DEPTH = 0;

class TaskQueue {
  constructor() {
    this.queue = [];
    this.scheduled = false;
  }

  enqueue(task) {
    if (task._enqueued) return;
    task._enqueued = true;
    this.queue.push(task);
    if (!this.scheduled && BATCH_DEPTH === 0) {
      this.scheduled = true;
      queueMicrotask(() => this._flush());
    }
  }

  _flush() {
    this.scheduled = false;
    if (!this.queue.length) return;

    if (this.queue.length > 1) {
      for (let i = 1; i < this.queue.length; i++) {
        let j = i, t = this.queue[i];
        while (j > 0 && this.queue[j - 1]._priority < t._priority) {
          this.queue[j] = this.queue[j - 1];
          j--;
        }
        this.queue[j] = t;
      }
    }

    const q = this.queue;
    for (let i = 0; i < q.length; i++) {
      const t = q[i];
      t._enqueued = false;
      t._run();
    }
    q.length = 0;
  }
}

const GLOBAL_QUEUE = new TaskQueue();

export class Signal {
  constructor(value) {
    this._value = value;
    this._subs = new Set();
  }

  get() {
    if (CURRENT_EFFECT) CURRENT_EFFECT._track(this);
    return this._value;
  }

  set(next) {
    if (this._value === next || (Number.isNaN(this._value) && Number.isNaN(next))) return;
    this._value = next;
    for (const eff of this._subs) eff._markDirty();
  }
}

export class Effect {
  constructor(fn, options = {}) {
    this.fn = fn;
    this._priority = options.priority || 0;
    this.scheduler = options.scheduler || GLOBAL_QUEUE;
    this.deps = new Set();
    this._dirty = true;
    this.active = true;
    this._enqueued = false;
    this._lazy = !!options.lazy;
    if (!this._lazy) this._run();
  }

  _track(signal) {
    this.deps.add(signal);
  }

  _markDirty() {
    if (!this._dirty) {
      this._dirty = true;
      this.scheduler.enqueue(this);
    }
  }

  _run() {
    if (!this.active || !this._dirty) return;
    this._dirty = false;

    for (const s of this.deps) s._subs.delete(this);
    this.deps.clear();

    const prev = CURRENT_EFFECT;
    CURRENT_EFFECT = this;
    try {
      this.fn();
    } finally {
      CURRENT_EFFECT = prev;
    }
  }

  dispose() {
    if (!this.active) return;
    this.active = false;
    for (const s of this.deps) s._subs.delete(this);
    this.deps.clear();
  }
}

export class Computed {
  constructor(getter, options = {}) {
    this._getter = getter;
    this._value = undefined;
    this._dirty = true;
    this._effect = new Effect(() => {
      this._value = getter();
      this._dirty = false;
    }, { scheduler: GLOBAL_QUEUE, lazy: true, priority: options.priority || 0 });
    this._subs = new Set();
  }

  get() {
    if (CURRENT_EFFECT) {
      this._subs.add(CURRENT_EFFECT);
      CURRENT_EFFECT.deps.add(this);
    }
    if (this._dirty) {
      this._effect._run();
      this._dirty = false;
    }
    return this._value;
  }
}

export function batch(fn) {
  if (BATCH_DEPTH === 0) {
    BATCH_DEPTH++;
    try {
      return fn();
    } finally {
      BATCH_DEPTH--;
      if (BATCH_DEPTH === 0) GLOBAL_QUEUE._flush();
    }
  }
  return fn();
}

export function signalStats(signal) {
  return { subscribers: signal._subs.size };
}

export function effectStats(effect) {
  return { deps: effect.deps.size, dirty: effect._dirty };
}

export const signal = (value) => new Signal(value);
export const effect = (fn, opts) => new Effect(fn, opts);
export const computedSignal = (getter, opts) => new Computed(getter, opts);
