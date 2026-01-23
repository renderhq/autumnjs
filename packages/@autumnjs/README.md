# Autumn.js

🚀 **The complete high-performance reactive framework**

[![npm](https://img.shields.io/npm/v/@autumnjs)](https://www.npmjs.com/package/@autumnjs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Quick Start

```bash
# Install the complete framework
npm install @autumnjs
# or
pnpm install @autumnjs  
# or
bun install @autumnjs
```

## Create a new project

```bash
# Using npm
npx create-autumns my-app

# Using pnpm
pnpm create autumns my-app

# Using Bun (fastest!)
bunx create-autumns my-app
```

## What's included

This meta-package includes:

- **@autumnjs/core** - High-performance reactive engine
- **@autumnjs/create-autumns** - CLI tool for creating new projects

## Usage

```javascript
import { signal, computed } from '@autumnjs';
// or import from specific packages
import { signal, computed } from '@autumnjs/core';

const count = signal(0);
const doubled = computed(() => count() * 2);

count(1);
console.log(doubled()); // 2
```

## Links

- [Documentation](https://github.com/renderhq/autumnjs)
- [Report Issues](https://github.com/renderhq/autumnjs/issues)
- [Follow us on X](https://x.com/infinterenders)

Made with ❤️ by the Autumn Team