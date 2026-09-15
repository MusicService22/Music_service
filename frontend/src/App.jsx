import { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import api from './api'
import Login from './pages/Login'
import './App.css'

function Home() {
  const [status, setStatus] = useState('checking...')

  useEffect(() => {
    api
      .get('health/')
      .then((res) => setStatus(res.data.status))
      .catch(() => setStatus('API connection unavailable'))
  }, [])

  return (
    <div className="app">
      <h1>MusicService</h1>

      <p>
        Django API status: <strong>{status}</strong>
      </p>

      <Link to="/login">Login</Link>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App