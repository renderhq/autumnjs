import { computed } from '@autumnjs/core'

interface AppProps {
  count: { value: number }
}

export default function App({ count }: AppProps) {
  const doubled = computed(() => count.value * 2)

  const increment = () => {
    count.value++
  }

  const decrement = () => {
    count.value--
  }

  return (
    <div className="p-8 font-sans">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Autumn.js</h1>
      <p className="text-gray-600 mb-8">A lightweight reactive framework for building web applications.</p>

      <div className="my-8 p-6 border border-gray-300 rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Signal Demo</h2>
        <p className="text-gray-700 mb-2">Current count: <strong className="text-blue-600">{count.value}</strong></p>
        <p className="text-gray-700 mb-4">Doubled: <strong className="text-green-600">{doubled.value}</strong></p>

        <div className="mt-4 flex gap-2">
          <button
            onClick={increment}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Increment
          </button>
          <button
            onClick={decrement}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Decrement
          </button>
        </div>
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Next Steps</h3>
        <ul className="space-y-2 text-gray-700">
          <li>• Edit <code className="bg-gray-200 px-1 rounded">src/App.tsx</code> to customize your app</li>
          <li>• Add components to <code className="bg-gray-200 px-1 rounded">src/components/</code></li>
          <li>• Use signals for reactive state management</li>
          <li>• Build amazing things! </li>
        </ul>
      </div>
    </div>
  )
}