import { useState } from 'react'
import { useFavorites } from '../context/FavoritesContext'

export default function FavoriteButton({ trackId }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const [busy, setBusy] = useState(false)
  const active = isFavorite(trackId)

  async function handleClick() {
    if (busy) return
    setBusy(true)
    try {
      await toggleFavorite(trackId)
    } catch (err) {
      if (err.response?.status === 401) {
        alert('Увійдіть в акаунт, щоб додавати в обране')
      } else {
        console.error(err)
        alert('Не вдалося оновити обране')
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      className="icon-button favorite-button"
      type="button"
      onClick={handleClick}
      disabled={busy}
      aria-pressed={active}
      aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
      title={active ? 'Remove from favorites' : 'Add to favorites'}
    >
      {active ? '♥' : '♡'}
    </button>
  )
}