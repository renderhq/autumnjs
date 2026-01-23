export * from './reactivity/index.js';
export * from './runtime/index.js';
export * from './components/index.js';
export * from './store/index.js';
export * from './lifecycle/index.js';
export * from './utils/index.js';
export * from './constants.js';
export * from './grid/index.js';
export { globalDispatcher as dispatcher } from './engine/dispatcher.js';

import { reactivity } from './reactivity/index.js';
import { runtime } from './runtime/index.js';
import { components } from './components/index.js';
import { store } from './store/index.js';
import { lifecycle } from './lifecycle/index.js';
import { utils } from './utils/index.js';
import { globalDispatcher } from './engine/dispatcher.js';
import { GridSystem } from './grid/index.js';

export const Autumn = {
  ...reactivity,
  ...runtime,
  ...lifecycle,
  ...utils,
  ...store,
  components,
  Grid: GridSystem,
  dispatcher: globalDispatcher,
};

export { Autumn as AutumnEngine };
export default Autumn;
