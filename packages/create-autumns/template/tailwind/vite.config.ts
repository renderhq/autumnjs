import { defineConfig } from 'vite'
import { autumn } from 'vite-plugin-autumn'

export default defineConfig({
  plugins: [autumn()],
  esbuild: {
    jsx: 'transform',
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  },
  server: {
    port: 3000,
    open: true
  }
})