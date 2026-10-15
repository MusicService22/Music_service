import { useState } from 'react'
import api from '../api'
import './Search.css'

function Search() {
  const [query, setQuery] = useState('')
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (event) => {
    event.preventDefault()

    const searchValue = query.trim()

    if (!searchValue) {
      setTracks([])
      setSearched(false)
      setError('')
      return
    }

    setLoading(true)
    setError('')
    setSearched(true)

    try {
      const response = await api.get(
        `tracks/?search=${encodeURIComponent(searchValue)}`
      )

      setTracks(response.data.results || response.data)
    } catch (err) {
      setTracks([])
      setError('Unable to load search results.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="search-page">
      <div className="search-container">
        <h1>Music Search</h1>

        <p className="search-description">
          Search for tracks by title or artist name.
        </p>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search music..."
          />

          <button type="submit">
            Search
          </button>
        </form>

        {loading && (
          <p className="search-message">
            Searching...
          </p>
        )}

        {error && (
          <p className="search-error">
            {error}
          </p>
        )}

        {!loading && searched && !error && tracks.length === 0 && (
          <p className="search-message">
            No tracks found.
          </p>
        )}

        {!loading && tracks.length > 0 && (
          <div className="tracks-list">
            {tracks.map((track) => (
              <div className="track-card" key={track.id}>
                <div>
                  <h2>{track.title}</h2>

                  <p>
                    {track.artist_name || track.artist?.name || 'Unknown artist'}
                  </p>
                </div>

                {track.duration_seconds !== undefined && (
                  <span className="track-duration">
                    {Math.floor(track.duration_seconds / 60)}:
                    {String(track.duration_seconds % 60).padStart(2, '0')}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Search