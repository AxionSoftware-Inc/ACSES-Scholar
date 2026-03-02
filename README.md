# ACSES Scholar

Next.js frontend + Django REST backend for class/subject/lesson platform with analytics.

## 1) Frontend (Next.js)

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

## 2) Backend (Django DRF)

```bash
cd backend
..\venv\Scripts\python manage.py migrate
..\venv\Scripts\python manage.py seed_scholar_data
..\venv\Scripts\python manage.py createsuperuser
..\venv\Scripts\python manage.py runserver
```

Backend runs on `http://127.0.0.1:8000`.

## Environment

Frontend `.env.local`:

```env
NEXT_PUBLIC_BACKEND_API_URL=http://127.0.0.1:8000/api/v1
```

Backend supports SQLite by default. For PostgreSQL set env vars:

- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_HOST`
- `POSTGRES_PORT`

## Main API

- `GET /api/v1/public/catalog/` - frontend uchun class/subject/lesson JSON
- `POST /api/v1/analytics/track/` - event tracking
- `GET /api/v1/analytics/dashboard/` - admin analytics (token required)
- `GET /api/v1/analytics/export/?type=top_pages|events&days=30` - CSV export
- `POST /api/v1/auth/admin-login/` - token login
- CRUD:
  - `/api/v1/categories/`
  - `/api/v1/classes/`
  - `/api/v1/subjects/`
  - `/api/v1/lessons/`
  - `/api/v1/contact-requests/`

## Admin

- Django admin: `http://127.0.0.1:8000/admin/`
- Front admin panel: `http://localhost:3000/admin-panel`
