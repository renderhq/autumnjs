# @autumnjs/core

The high-performance reactive engine powering the Autumn ecosystem.

## Features

- **Deterministic Reactivity**: Based on a reactive DAG for predictable updates.
- **Low Latency**: Optimized for real-time UIs and heavy data pipelines.
- **Multi-threaded**: Background processing and compute lanes.
- **Framework Agnostic**: Renders to many targets (Solid, Preact supported).

## Installation

```bash
pnpm add @autumnjs/core
```

## Usage

```tsx
import { signal, computed, render } from '@autumnjs/core';

const count = signal(0);
const doubled = computed(() => count.value * 2);

function App() {
  return (
    <div>
      <h1>Count: {count.value}</h1>
      <p>Doubled: {doubled.value}</p>
      <button onClick={() => count.value++}>Increment</button>
    </div>
  );
}

render(App, document.getElementById('root'));
```

## License

MIT
