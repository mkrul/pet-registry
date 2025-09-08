Docker Guide
============

This project ships with a docker-compose setup for development and a multi-stage Dockerfile for production builds.

Prerequisites

- Docker 24+
- Docker Compose v2

Services (docker-compose.yml)

- postgres: PostgreSQL 15 database (port 5432 exposed)
- redis: Redis 7 (port 16379->6379 exposed)
- opensearch: OpenSearch 2.11 (ports 19200->9200, 19600->9600)
- web: Rails app in development mode
- vite: Vite dev server for React on 3036
- css: Tailwind CSS watcher
- typescript: TypeScript type checker

Quick Start (Development)

1. Create a `.env` file (optional) and export any secrets like `RAILS_MASTER_KEY`.
2. Build and start:
   - `docker compose up --build`
3. Open:
   - Rails: http://localhost:3000
   - Vite dev server: http://localhost:3036
   - OpenSearch: http://localhost:19200

Database & Migrations

- The `web` service runs `rails db:prepare` automatically on start.
- To run migrations manually:
  - `docker compose exec web bin/rails db:migrate`

Search Indexing

- Trigger full reindex (with OpenSearch healthy):
  - `docker compose exec -e REINDEX=1 web true` (or restart web with `REINDEX=1` env)
  - Alternatively:
    - `docker compose exec web bin/rails searchkick:reindex:all --trace`

Rails Console / Rake

- Console: `docker compose exec web bin/rails console`
- Rake: `docker compose exec web bin/rake -T`

Running Tests

- Backend (RSpec): `docker compose exec web bundle exec rspec`
- Frontend (Vitest): `docker compose exec vite yarn test`

Environment Variables

- `RAILS_MASTER_KEY`: required to access credentials
- `DATABASE_URL` or individual PG vars are set for `web` by compose
- `REDIS_URL`, `OPENSEARCH_URL` are pre-wired in compose

Volumes

- `postgres_data`, `redis_data`, `opensearch_data`, `bundle_cache`, `node_modules`
- Clear a volume (example): `docker volume rm pet-registry_postgres_data`

Useful Commands

- Rebuild only app images: `docker compose build web vite css typescript`
- View logs for one service: `docker compose logs -f web`
- Run a one-off task: `docker compose run --rm web bin/rails db:seed`

Production Image (Reference)

- Build production image:
  - `docker build -t pet-registry:prod --target production .`
- Run (example):
  - `docker run -p 3000:3000 -e RAILS_MASTER_KEY=... pet-registry:prod`
- In production, you must provide a Postgres, Redis, and OpenSearch endpoint via env vars.

Troubleshooting

- If `web` waits on dependencies, check health of postgres/redis/opensearch:
  - `docker compose ps`
- If OpenSearch fails to start due to memory:
  - Increase Docker memory or lower `OPENSEARCH_JAVA_OPTS` in compose.
- If ports are in use, adjust published ports in `docker-compose.yml`.


