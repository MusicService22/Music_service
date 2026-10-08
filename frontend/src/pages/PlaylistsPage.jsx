import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPlaylists, createPlaylist, deletePlaylist } from '../api'

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([])
  const [name, setName] = useState('')

  useEffect(() => {
    getPlaylists().then(setPlaylists).catch(() => setPlaylists([]))
  }, [])

  async function handleCreate(e) {
    e.preventDefault()
    if (!name.trim()) return
    try {
      const created = await createPlaylist(name.trim())
      setPlaylists((prev) => [...prev, created])
      setName('')
    } catch (err) {
      alert(err.response?.status === 401 ? 'Увійдіть в акаунт' : 'Не вдалося створити плейлист')
    }
  }

  async function handleDelete(id) {
    try {
      await deletePlaylist(id)
      setPlaylists((prev) => prev.filter((p) => p.id !== id))
    } catch {
      alert('Не вдалося видалити плейлист')
    }
  }

  return (
    <section className="content-section" aria-labelledby="playlists-page-title">
      <Link to="/">← Home</Link>
      <h2 id="playlists-page-title">Playlists</h2>

      <form onSubmit={handleCreate}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Назва плейлиста"
        />{' '}
        <button className="primary-button" type="submit">Створити</button>
      </form>

      <div className="playlist-stack">
        {playlists.map((p) => (
          <article className="playlist-row" key={p.id}>
            <div>
              <h3>{p.name}</h3>
              <p>{p.playlist_tracks.length} tracks</p>
            </div>
            <button className="secondary-button" type="button" onClick={() => handleDelete(p.id)}>
              Видалити
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}