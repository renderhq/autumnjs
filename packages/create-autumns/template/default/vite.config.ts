import { defineConfig } from 'vite'
import preset from '@preact/preset-vite'

export default defineConfig({
  plugins: [preset()],
  resolve: {
    alias: {
      '@autumnjs/core': '../../core/src'
    }
  },
  server: {
    port: 3000,
    open: true
  }
})