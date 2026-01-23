
# Autumn.js — A Deterministic, Low-Latency Frontend Engine

Autumn.js is a **reactive, deterministic, multi-threaded frontend runtime** designed for extremely large datasets and real-time UIs. It avoids the traditional VDOM model and instead uses a **reactive DAG**, a **custom scheduler**, and **GPU-aware rendering paths** to guarantee predictable performance.

It is optimized for scenarios where:

* The UI must remain stable under heavy load
* Data pipelines exceed millions of elements
* The main thread cannot stall
* Sorting, filtering, and scrolling occur simultaneously

---

## Core Concepts

### 1. Reactive DAG (Directed Acyclic Graph)

* Signals map directly to atomic nodes in a DAG
* Updates are deterministic
* No component re-renders
* Downstream computations re-run only when their inputs change
* DOM becomes a leaf node, not the engine of recomputation

> Contrast with React, where component re-renders cascade through the tree.

### 2. Frame-Deterministic Scheduler

Autumn.js maintains a **four-phase loop**:

1. Input
2. Animation
3. Render
4. Background (worker tasks)

This ensures:

* No GC surprises
* Predictable frame durations
* Render commits always happen in the same order
* Sorting/filtering never interrupts scrolling frames

### 3. Multi-Threaded Data Pipeline

Autumn.js uses:

* SharedArrayBuffer
* Atomics
* Typed arrays
* Worker “lanes”

This allows:

* Sorting and filtering off the main thread
* Zero-copy access to results
* Stable update cycles
* Background tasks without blocking animation frames

### 4. Custom Virtualization

* Browser height limits do not apply
* Stable row window and GPU-transformed container
* All calculations done in typed memory
* Millions of rows scroll smoothly with no DOM churn

---

## Example: Integrating Autumn.js in an App

```tsx
import { signal, computed, render } from "@autumnjs/core";

// Signals
const count = signal(0);
const doubled = computed(() => count.value * 2);

// Rendering a component
function App() {
  const increment = () => {
    count.value++;
  };

  return (
    <div className="counter">
      <h1>Autumn Counter</h1>
      <p>Count: {count.value}</p>
      <p>Doubled: {doubled.value}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

// Mount the app
const root = document.getElementById("app");
if (root) {
  render(App, root);
}
```

**Notes:**

* `render` binds the reactive nodes to DOM leaves.
* Updates are surgical—only the parts of the DOM that depend on changed signals are updated.

---

## Performance Characteristics

### Scrolling

* Virtual window height never changes
* GPU transform moves the window
* No DOM mutations while scrolling
* Maintains 60–120fps on stable hardware

### Filtering & Sorting

* Done in Web Workers
* Results stored in SharedArrayBuffer
* Main thread only updates row indices
* No garbage created in hot paths

### Memory Behavior

* Object pools for cell instances
* Recyclable DOM node strategy
* Typed arrays for all row-level metadata
* Eliminates GC interruptions

---

## Architecture Overview

```
Application Layer
  UI components: grids, dashboards, controls
Signals & Reactivity
  Atomic DAG nodes, deterministic propagation
Scheduler Engine
  Input → Animation → Render → Background
Renderer Layer
  DOM commits, GPU transforms, zero-churn updates
Data & Memory Layer
  Typed arrays, SharedArrayBuffers, object pools
```

Each layer is standalone and observable.

---

## Why It Works

Autumn.js avoids every performance trap common in frameworks:

* No VDOM
* No component re-render cycles
* No diffing
* No unbounded object creation
* No layout thrash
* No uncontrolled GC

The system is **data-oriented**, not component-oriented.

---

## Installation

```bash
# Clone the repo
git clone https://github.com/renderhq/autumnjs.git
cd autumnjs

# Install dependencies using pnpm
pnpm install

# Build the packages
pnpm build

# Start development
pnpm dev
```

---

## Running a Grid Example

```ts
import { GridView } from "./GridView";
function App() {
  return <GridView />;
}
```

---

## Questions You Might Be Asked

1. **How does Autumn.js achieve deterministic rendering?**
   **Answer:**
   By enforcing a fixed 4-phase frame loop and preventing state changes during render.
   Signals update → scheduler commits → DOM patched → workers run in background.
   No mid-frame updates or unpredictable re-renders occur.

2. **How do workers sort/filter without blocking the UI?**
   **Answer:**
   All datasets live in SharedArrayBuffer-backed typed arrays.
   Workers compute new row orders by writing indices into the shared buffer.
   The main thread reads these indices without copying data or allocating objects.
---

## License

MIT — includes examples, benchmark harness, DAG inspector, FPS overlays

