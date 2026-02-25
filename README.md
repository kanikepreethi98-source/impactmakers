# VidyaAI v3 — Backend

## Setup

```bash
npm install
node server.js
```

## Endpoints

- `POST /api/auth/register` — Register student or teacher
- `POST /api/auth/login` — Login (student or teacher)
- `GET /api/teacher/students` — Get all students (teacher only)
- `POST /api/teacher/notify` — Send notification to all students

## Environment

Create `.env`:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Notes

- No hardcoded credentials. All users are registered via the UI.
- Teachers must self-register using the Teacher portal.
- The frontend uses localStorage as a fallback when backend is not available.
