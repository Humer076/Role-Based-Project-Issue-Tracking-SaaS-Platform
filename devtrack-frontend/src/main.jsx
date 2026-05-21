import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// Simple test component
function App() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1 className="text-3xl font-bold text-blue-600">DevTrack is working! 🚀</h1>
      <p className="mt-4">If you see this, React is rendering correctly.</p>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
