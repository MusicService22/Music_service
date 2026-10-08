import axios from 'axios'

const api = axios.create({
  baseURL: '/api/',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const unwrapList = (data) => (Array.isArray(data) ? data : data.results ?? [])

export const getFavorites = async () => unwrapList((await api.get('favorites/')).data)
export const addFavorite = async (trackId) =>
  (await api.post('favorites/', { track_id: trackId })).data
export const removeFavorite = (favoriteId) => api.delete(`favorites/${favoriteId}/`)

export const getPlaylists = async () => unwrapList((await api.get('playlists/')).data)
export const createPlaylist = async (name) =>
  (await api.post('playlists/', { name })).data
export const deletePlaylist = (playlistId) => api.delete(`playlists/${playlistId}/`)
export default api