import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getFavorites, addFavorite, removeFavorite, getAccessToken } from '../api'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([])

  // Завантажуємо обране, тільки якщо є токен (користувач увійшов)
  const reloadFavorites = useCallback(async () => {
    if (!getAccessToken()) {
      setFavorites([])
      return
    }
    try {
      setFavorites(await getFavorites())
    } catch {
      setFavorites([])
    }
  }, [])

  useEffect(() => {
    reloadFavorites()
  }, [reloadFavorites])

  const isFavorite = (trackId) => favorites.some((f) => f.track.id === trackId)

  // Додає трек в обране або прибирає, якщо він там уже є
  async function toggleFavorite(trackId) {
    const existing = favorites.find((f) => f.track.id === trackId)
    if (existing) {
      await removeFavorite(existing.id)
      setFavorites((prev) => prev.filter((f) => f.id !== existing.id))
    } else {
      const created = await addFavorite(trackId)
      setFavorites((prev) => [...prev, created])
    }
  }

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, reloadFavorites }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => useContext(FavoritesContext)