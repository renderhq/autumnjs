import { render } from '@autumnjs/core'
import App from './App'

const app = document.getElementById('app')
if (!app) throw new Error('Root element not found')

render(App(), app)