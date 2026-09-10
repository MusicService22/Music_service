# MusicService

Каркас проекту: **React (Vite)** на фронтенді + **Django REST Framework** на бекенді.

## Структура

```
MusicService/
├── backend/          # Django REST API
│   ├── config/        # налаштування проекту (settings, urls)
│   ├── api/            # застосунок з моделями Artist/Track, серіалізаторами, view'ами
│   ├── manage.py
│   └── requirements.txt
├── frontend/          # React (Vite)
│   ├── src/
│   └── package.json
└── .vscode/            # готові таски для VS Code
```

## Запуск бекенду (Django)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser   # опційно, для адмінки
python manage.py runserver
```

API підніметься на `http://127.0.0.1:8000/`.
Перевірка: `http://127.0.0.1:8000/api/health/` → `{"status": "ok"}`.

## Запуск фронтенду (React)

```bash
cd frontend
npm install
npm run dev
```

Фронтенд підніметься на `http://127.0.0.1:5173/` і автоматично проксує запити `/api/*` на Django (налаштовано в `vite.config.js`).

## Запуск обох сервісів у VS Code

У корені проекту відкрий палітру команд (`Ctrl+Shift+P`) → **Tasks: Run Task** → **Run All**.
Це запустить одночасно `Backend: runserver` і `Frontend: dev` (конфіг у `.vscode/tasks.json`).

## Основні ендпоінти API

| Метод | URL                     | Опис                          |
|-------|-------------------------|-------------------------------|
| GET   | `/api/health/`          | перевірка, що API живе        |
| GET   | `/api/artists/`         | список артистів                |
| POST  | `/api/artists/`         | створити артиста                |
| GET   | `/api/tracks/`          | список треків                   |
| POST  | `/api/tracks/`          | створити трек                    |
| POST  | `/api/token/`           | отримати JWT (access + refresh) |
| POST  | `/api/token/refresh/`   | оновити access-токен            |

## Наступні кроки для команди

- [ ] Підʼєднати репозиторій до `https://github.com/MusicService22`
- [ ] Замінити SQLite на PostgreSQL для продакшена
- [ ] Додати CI (лінтер + тести) через GitHub Actions
- [ ] Продумати доменну модель (плейлисти, користувачі, лайки тощо)
- [ ] Додати Docker/Docker Compose, якщо потрібно однакове середовище для всіх
