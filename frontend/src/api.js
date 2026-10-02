import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/'
const ACCESS_TOKEN_KEY = 'musicservice.accessToken'
const REFRESH_TOKEN_KEY = 'musicservice.refreshToken'

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setAuthTokens({ access, refresh }) {
  if (access) {
    localStorage.setItem(ACCESS_TOKEN_KEY, access)
  }

  if (refresh) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
  }
}

export function clearAuthTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

function getErrorMessage(error) {
  if (!error.response) {
    return 'Немає з’єднання з сервером'
  }

  const { data, status } = error.response

  if (typeof data === 'string') {
    return data
  }

  if (data?.detail) {
    return data.detail
  }

  if (data?.message) {
    return data.message
  }

  if (status === 400) {
    return 'Перевірте дані форми'
  }

  if (status === 401) {
    return 'Потрібно увійти в акаунт'
  }

  if (status === 403) {
    return 'Недостатньо прав для цієї дії'
  }

  if (status >= 500) {
    return 'Помилка сервера, спробуйте пізніше'
  }

  return 'Сталася помилка запиту'
}

export function normalizeApiError(error) {
  const normalizedError = new Error(getErrorMessage(error))

  normalizedError.status = error.response?.status
  normalizedError.data = error.response?.data
  normalizedError.fieldErrors = error.response?.data && typeof error.response.data === 'object'
    ? error.response.data
    : null
  normalizedError.isNetworkError = !error.response

  return normalizedError
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const refreshToken = getRefreshToken()
    const isRefreshRequest = originalRequest?.url?.includes('token/refresh/')

    if (error.response?.status === 401 && refreshToken && !originalRequest._retry && !isRefreshRequest) {
      originalRequest._retry = true

      try {
        const response = await api.post('token/refresh/', { refresh: refreshToken })
        setAuthTokens({ access: response.data.access })
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`

        return api(originalRequest)
      } catch (refreshError) {
        clearAuthTokens()
        return Promise.reject(normalizeApiError(refreshError))
      }
    }

    return Promise.reject(normalizeApiError(error))
  },
)

export const apiClient = {
  get: (url, config) => api.get(url, config).then((response) => response.data),
  post: (url, data, config) => api.post(url, data, config).then((response) => response.data),
  put: (url, data, config) => api.put(url, data, config).then((response) => response.data),
  patch: (url, data, config) => api.patch(url, data, config).then((response) => response.data),
  delete: (url, config) => api.delete(url, config).then((response) => response.data),
}

export const authApi = {
  async login(credentials) {
    const tokens = await apiClient.post('token/', credentials)
    setAuthTokens(tokens)
    return tokens
  },
  logout() {
    clearAuthTokens()
  },
  refresh() {
    return apiClient.post('token/refresh/', { refresh: getRefreshToken() })
  },
}

export default api
