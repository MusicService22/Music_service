import { useEffect, useState } from 'react'
import api from './api'
import './App.css'

function App() {
  const [status, setStatus] = useState('перевірка...')

  useEffect(() => {
    api
      .get('health/')
      .then((res) => setStatus(res.data.status))
      .catch(() => setStatus('немає з’єднання з API'))
  }, [])

  return (
    <div className="app">
      <h1>MusicService</h1>
      <p>Статус Django API: <strong>{status}</strong></p>
    </div>
  )
}

export default App
