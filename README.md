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

## Docker Production Deploy

Bu repo backend submodule bilan ishlaydi:

```bash
git clone --recurse-submodules https://github.com/ACSES-corp/ACSES-Scholar.git
cd ACSES-Scholar
```

Serverda env fayllarni tayyorlang:

```bash
cp deploy/env/frontend.env.example deploy/env/frontend.env
cp deploy/env/backend.env.example deploy/env/backend.env
cp deploy/env/db.env.example deploy/env/db.env
```

Keyin production stackni ishga tushiring:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Nginx `80` portda ishlaydi:

- Frontend: `http://your-domain/`
- API: `http://your-domain/api/v1/`
- Django admin: `http://your-domain/django-admin/`

## Alternate Port Deploy

Agar serverda `80` portda boshqa loyiha ishlayotgan bo'lsa, nginx'siz variantni ishlating:

```bash
docker compose -f docker-compose.server.yml up -d --build
```

Bu holda:

- Frontend: `http://your-server:8081`
- Django admin: `http://your-server:8081/django-admin/`
- API: `http://your-server:8081/api/v1/`

## Update Workflow

Lokal o'zgarishlardan keyin:

1. Frontend o'zgargan bo'lsa `ACSES-Scholar` repo'ga push qiling.
2. Backend o'zgargan bo'lsa `Scholar-Backend` repo'ga push qiling.
3. Serverda ushbu buyruqni ishlating:

```bash
./scripts/server-update.sh
```

Bu skript:

- root repo uchun `git pull` qiladi
- backend submodule'ni init/update qiladi
- backend repo ichida ham `git pull` qiladi
- `docker compose up -d --build` bilan containerlarni yangilaydi

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
