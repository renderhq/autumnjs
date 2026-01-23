import { signal } from '@autumnjs/core'

export default function App() {
  const count = signal(0)

  const increment = () => {
    count.value = count.value + 1
  }

  const decrement = () => {
    count.value = count.value - 1
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <h1 style={{ color: '#333', marginBottom: '2rem' }}>🍂 Autumn Counter</h1>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '3rem', color: '#4f46e5', margin: '0' }}>{count.value}</h2>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button
          onClick={increment}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Add (+)
        </button>

        <button
          onClick={decrement}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Subtract (-)
        </button>
      </div>

      <div style={{ marginTop: '2rem', color: '#6b7280' }}>
        <p>Current count: {count.value}</p>
        {count.value === 0 && <p>Start counting! </p>}
        {count.value > 0 && count.value <= 5 && <p>Keep going</p>}
        {count.value > 5 && count.value <= 10 && <p>Great progress</p>}
        {count.value > 10 && <p>You're on fire!</p>}
        {count.value < 0 && <p>Going negative!</p>}
      </div>
    </div>
  )
}