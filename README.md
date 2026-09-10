# MusicService

Базовий каркас музичного сервісу: **React (Vite)** на фронтенді + **Django REST Framework** на бекенді.

## Що потрібно встановити

- Python 3.12
- Node.js 20+
- npm 10+
- Git

У корені репозиторію є файли `.python-version` і `.node-version`, щоб команда орієнтувалася на однакові версії.

## Структура

```text
MusicService/
├── backend/          # Django REST API
│   ├── config/       # settings, urls, wsgi/asgi
│   ├── api/          # Artist/Track, serializers, views, urls, tests
│   ├── manage.py
│   └── requirements.txt
├── frontend/         # React (Vite)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── .vscode/          # готові VS Code tasks
```

## Запуск backend

```bash
cd backend
python -m venv venv
```

Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
copy .env.example .env
pip install -r requirements.txt
python manage.py migrate
python manage.py test
python manage.py runserver
```

macOS/Linux:

```bash
source venv/bin/activate
cp .env.example .env
pip install -r requirements.txt
python manage.py migrate
python manage.py test
python manage.py runserver
```

Backend буде доступний на `http://127.0.0.1:8000/`.

Швидка перевірка:

```text
http://127.0.0.1:8000/api/health/
```

Очікувана відповідь:

```json
{"status": "ok"}
```

## Запуск frontend

```bash
cd frontend
npm install
npm run lint
npm run dev
```

Якщо PowerShell блокує команду `npm`, використовуйте `npm.cmd`:

```powershell
npm.cmd install
npm.cmd run lint
npm.cmd run dev
```

Frontend буде доступний на `http://127.0.0.1:5173/`.

Vite проксує запити `/api/*` на Django API `http://127.0.0.1:8000`.

## Основні API endpoints

| Метод | URL                   | Опис |
| ----- | --------------------- | ---- |
| GET   | `/api/health/`        | перевірка, що API працює |
| GET   | `/api/artists/`       | список артистів |
| POST  | `/api/artists/`       | створити артиста |
| GET   | `/api/tracks/`        | список треків |
| POST  | `/api/tracks/`        | створити трек |
| POST  | `/api/token/`         | отримати JWT access/refresh |
| POST  | `/api/token/refresh/` | оновити access token |

## Запуск через VS Code

У корені проекту відкрийте Command Palette:

```text
Ctrl+Shift+P -> Tasks: Run Task -> Run All
```

Це запустить backend і frontend паралельно через конфіг `.vscode/tasks.json`.

## Definition of Done для стабільного старту

- `npm install` проходить без `--legacy-peer-deps`.
- `npm run lint` проходить без помилок.
- `python manage.py migrate` створює таблиці для `Artist` і `Track`.
- `python manage.py test` проходить.
- `/api/health/` повертає `{"status": "ok"}`.
- React-сторінка показує статус Django API.

## Наступні кроки для команди

- Додати моделі `Album`, `Playlist`, `Favorite`.
- Додати реєстрацію користувача та endpoint `/api/me/`.
- Зробити сторінки `Tracks`, `Artists`, `Login`, `Register`.
- Додати пошук і фільтрацію треків.
- Додати CI через GitHub Actions.
