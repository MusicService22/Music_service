import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAccessToken, getPremium, activatePremium, cancelPremium } from '../api'

// Показує, наприклад, "1 / 2" для Free або "5 / ∞" для Premium
const formatLimit = ({ used, limit }) => `${used} / ${limit ?? '∞'}`

export default function PremiumPage() {
  const loggedIn = Boolean(getAccessToken())
  const [info, setInfo] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!loggedIn) return
    getPremium()
      .then(setInfo)
      .catch((err) => setError(err.message))
  }, [loggedIn])

  async function change(action) {
    setBusy(true)
    setError('')
    try {
      setInfo(await action())
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (!loggedIn) {
    return (
      <section className="content-section">
        <Link to="/">← Home</Link>
        <p>Увійдіть в акаунт, щоб керувати підпискою.</p>
      </section>
    )
  }

  return (
    <section className="content-section premium-page" aria-labelledby="premium-title">
      <Link to="/">← Home</Link>
      <h2 id="premium-title">Premium</h2>

      {error && <p>{error}</p>}
      {!info && !error && <p>Завантаження...</p>}

      {info && (
        <>
          <p>
            Ваш план: <strong>{info.is_premium ? '⭐ Premium' : 'Free'}</strong>
            {info.is_premium && info.expires_at && (
              <> (діє до {new Date(info.expires_at).toLocaleDateString('uk-UA')})</>
            )}
          </p>

          <div className="playlist-stack">
            <article className="playlist-row">
              <div>
                <h3>Обране</h3>
                <p>Використано: {formatLimit(info.favorites)}</p>
              </div>
            </article>
            <article className="playlist-row">
              <div>
                <h3>Плейлисти</h3>
                <p>Використано: {formatLimit(info.playlists)}</p>
              </div>
            </article>
          </div>

          <div className="premium-plans">
            <div className="premium-plan">
              <h3>Free</h3>
              <ul>
                <li>Обране: до {info.free_limits.favorites} треків</li>
                <li>Плейлисти: до {info.free_limits.playlists}</li>
              </ul>
            </div>
            <div className="premium-plan premium-plan-pro">
              <h3>⭐ Premium</h3>
              <ul>
                <li>Необмежене обране</li>
                <li>Необмежена кількість плейлистів</li>
              </ul>
            </div>
          </div>

          {info.is_premium ? (
            <button
              className="secondary-button"
              type="button"
              disabled={busy}
              onClick={() => change(cancelPremium)}
            >
              Скасувати Premium
            </button>
          ) : (
            <button
              className="primary-button"
              type="button"
              disabled={busy}
              onClick={() => change(activatePremium)}
            >
              Оформити Premium (демо, 30 днів)
            </button>
          )}
        </>
      )}
    </section>
  )
}