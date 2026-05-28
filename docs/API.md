# API Documentation

Full OpenAPI specification: [openapi.yaml](./openapi.yaml)

## Base URL

```
http://localhost:3001/api/v1
```

## Interactive docs

When the server is running:

```
http://localhost:3001/api/v1/docs
```

## Authentication

Most endpoints require a Bearer token:

```
Authorization: Bearer <access_token>
```

Obtain tokens via `POST /auth/login` or `POST /auth/register` + login.

Refresh expired access tokens with `POST /auth/refresh`.

## Endpoint groups

| Group | Prefix | Description |
|-------|--------|-------------|
| Auth | `/auth` | Register, login, refresh, logout |
| Users | `/users` | Profile and advanced settings |
| Workouts | `/workouts` | AI plans, logs, history |
| Nutrition | `/nutrition` | Meals, water, AI food scan |
| AI | `/ai` | Chat coach |
| Progress | `/progress` | Body metrics, sleep |
| Challenges | `/challenges` | Social leaderboard |
| Admin | `/admin` | Dashboard stats (ADMIN role) |
