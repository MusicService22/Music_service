import axios from 'axios'

// В dev-режимі запити на /api проксуються Vite-сервером на Django (див. vite.config.js)
const api = axios.create({
  baseURL: '/api/',
})

export default api
