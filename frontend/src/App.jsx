import { useEffect, useState } from 'react'
import api from './api'
import './App.css'

const featuredTracks = [
  {
    id: 1,
    title: 'Neon Route',
    artist: 'Mila Ray',
    album: 'Late Signals',
    duration: '3:42',
    mood: 'Electronic',
    cover: 'cover cover-sky',
  },
  {
    id: 2,
    title: 'Quiet Room',
    artist: 'Anton Vale',
    album: 'Soft Static',
    duration: '4:08',
    mood: 'Indie',
    cover: 'cover cover-coral',
  },
  {
    id: 3,
    title: 'Night Metro',
    artist: 'Sana Blue',
    album: 'City Frame',
    duration: '2:57',
    mood: 'Pop',
    cover: 'cover cover-green',
  },
]

const quickPlaylists = [
  { name: 'Daily Mix', count: '24 tracks' },
  { name: 'Focus Flow', count: '18 tracks' },
  { name: 'New Ukrainian Indie', count: '31 tracks' },
]

const artists = ['Mila Ray', 'Anton Vale', 'Sana Blue', 'Kolo Sound']

function App() {
  const [status, setStatus] = useState('перевірка...')

  useEffect(() => {
    api
      .get('health/')
      .then((res) => setStatus(res.data.status))
      .catch(() => setStatus('немає з’єднання з API'))
  }, [])

  const isConnected = status === 'ok'

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Main navigation">
        <div className="brand">
          <span className="brand-mark">MS</span>
          <span>MusicService</span>
        </div>

        <nav className="nav-list">
          <a className="nav-link active" href="#home">Home</a>
          <a className="nav-link" href="#tracks">Tracks</a>
          <a className="nav-link" href="#artists">Artists</a>
          <a className="nav-link" href="#playlists">Playlists</a>
          <a className="nav-link" href="#favorites">Favorites</a>
        </nav>

        <section className="library-block" aria-labelledby="library-title">
          <h2 id="library-title">Library</h2>
          {quickPlaylists.map((playlist) => (
            <button className="library-item" type="button" key={playlist.name}>
              <span>{playlist.name}</span>
              <small>{playlist.count}</small>
            </button>
          ))}
        </section>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <label className="search-box">
            <span className="sr-only">Search</span>
            <input type="search" placeholder="Search tracks, artists, albums" />
          </label>

          <div className="topbar-actions">
            <span className={isConnected ? 'api-status online' : 'api-status offline'}>
              API {isConnected ? 'online' : status}
            </span>
            <button className="secondary-button" type="button">Log in</button>
            <button className="primary-button" type="button">Sign up</button>
          </div>
        </header>

        <section className="overview-band" id="home">
          <div>
            <p className="eyebrow">Today</p>
            <h1>Friday Evening Mix</h1>
            <p className="overview-copy">
              Neon Route, Quiet Room, Night Metro, and more tracks queued for tonight.
            </p>
          </div>
          <button className="primary-button large" type="button">Start listening</button>
        </section>

        <section className="content-section" id="tracks" aria-labelledby="tracks-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Catalog</p>
              <h2 id="tracks-title">Featured tracks</h2>
            </div>
            <button className="text-button" type="button">View all</button>
          </div>

          <div className="track-grid">
            {featuredTracks.map((track) => (
              <article className="track-card" key={track.id}>
                <div className={track.cover} aria-hidden="true">
                  <span>{track.title.slice(0, 1)}</span>
                </div>
                <div className="track-info">
                  <h3>{track.title}</h3>
                  <p>{track.artist}</p>
                  <span>{track.album}</span>
                </div>
                <div className="track-meta">
                  <span>{track.mood}</span>
                  <strong>{track.duration}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="content-grid">
          <div className="content-section" id="artists" aria-labelledby="artists-title">
            <div className="section-heading compact">
              <h2 id="artists-title">Artists</h2>
              <button className="text-button" type="button">Manage</button>
            </div>

            <div className="artist-list">
              {artists.map((artist, index) => (
                <button className="artist-row" type="button" key={artist}>
                  <span className={`artist-avatar tone-${index + 1}`}>{artist.slice(0, 1)}</span>
                  <span>{artist}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="content-section" id="playlists" aria-labelledby="playlists-title">
            <div className="section-heading compact">
              <h2 id="playlists-title">Playlists</h2>
              <button className="text-button" type="button">New</button>
            </div>

            <div className="playlist-stack">
              {quickPlaylists.map((playlist) => (
                <article className="playlist-row" key={playlist.name}>
                  <div>
                    <h3>{playlist.name}</h3>
                    <p>{playlist.count}</p>
                  </div>
                  <button className="icon-button" type="button" title={`Play ${playlist.name}`} aria-label={`Play ${playlist.name}`}>
                    &gt;
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="player-bar" aria-label="Music player">
        <div className="now-playing">
          <div className="mini-cover cover-green" aria-hidden="true">N</div>
          <div>
            <strong>Night Metro</strong>
            <span>Sana Blue</span>
          </div>
        </div>

        <div className="player-controls">
          <button className="icon-button" type="button" title="Previous track" aria-label="Previous track">
            &lt;&lt;
          </button>
          <button className="play-button" type="button" title="Play" aria-label="Play">
            &gt;
          </button>
          <button className="icon-button" type="button" title="Next track" aria-label="Next track">
            &gt;&gt;
          </button>
        </div>

        <div className="progress-wrap" aria-label="Track progress">
          <span>1:14</span>
          <div className="progress-track">
            <div className="progress-fill" />
          </div>
          <span>2:57</span>
        </div>
      </footer>
    </div>
  )
}

export default App
