import { render, signal } from '@autumnjs/core'
import './index.css'
import App from './App'

const count = signal(0)

const app = document.getElementById('app')
if (!app) throw new Error('Root element not found')

render(App({ count }), app)