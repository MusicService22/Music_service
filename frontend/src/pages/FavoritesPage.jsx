import { Link } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext'

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites()

  if (favorites.length === 0) {
    return (
      <section className="content-section">
        <Link to="/">← Home</Link>
        <p>В обраному поки порожньо.</p>
      </section>
    )
  }

  return (
    <section className="content-section" aria-labelledby="favorites-title">
      <Link to="/">← Home</Link>
      <h2 id="favorites-title">Favorites</h2>
      <div className="playlist-stack">
        {favorites.map((f) => (
          <article className="playlist-row" key={f.id}>
            <div>
              <h3>{f.track.title}</h3>
              <p>{f.track.artist_name}</p>
            </div>
            <button
              className="secondary-button"
              type="button"
              onClick={() => toggleFavorite(f.track.id)}
            >
              Видалити
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}