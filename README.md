Pet Registry
===========

A Ruby on Rails API with a React (Vite) frontend for reporting and searching lost/found pets. Includes PostgreSQL, Redis, and OpenSearch (Searchkick) integrations.

Getting Started (Local)
-----------------------

Prerequisites

- Ruby 3.3.x
- Node 18.x and Yarn 1.x
- PostgreSQL 15+
- Redis 7+
- OpenSearch 2.11+ (optional locally; only required for search features)

Setup

1. Install Ruby gems:
   - `bundle install`
2. Install Node packages:
   - `yarn install`
3. Configure database:
   - Ensure PostgreSQL is running
   - Create and migrate:
     - `bin/rails db:setup` (or `bin/rails db:create db:migrate db:seed`)
4. Environment:
   - Ensure `config/master.key` or `RAILS_MASTER_KEY` is present for credentials
   - For OpenSearch, set `OPENSEARCH_URL` (e.g., `http://localhost:9200`)

Development

- Start Rails API:
  - `bin/rails s`
- Start Vite dev server:
  - `bin/vite dev` (or `yarn dev`)
- Optional helpers:
  - Tailwind CSS watcher: `yarn build:css --watch`
  - TypeScript watch: `yarn ts-check`
- Alternatively use process manager:
  - `foreman start -f Procfile.dev` (requires foreman)

Testing

- Backend (RSpec):
  - `bundle exec rspec`
- Frontend (Vitest):
  - `yarn test`
  - UI mode: `yarn test:ui`
  - Coverage: `yarn coverage`

Project Structure

- Rails app in `app/` (models, controllers, serializers, services)
- React app in `app/src/` (components, pages, hooks, redux)
- Vite config in `vite.config.mts`; entrypoints under `app/javascript/entrypoints/`
- Tailwind CSS input at `app/javascript/entrypoints/application.css`, output at `app/assets/builds/application.css`

Environment Variables

- `DATABASE_URL` or individual PG vars (`POSTGRES_HOST`, `POSTGRES_USER`, etc.)
- `REDIS_URL` for Action Cable/cache
- `OPENSEARCH_URL` for Searchkick/OpenSearch
- `RAILS_MASTER_KEY` for credentials (in CI/containers) or `config/master.key` locally

Production Build (Container)

- See `DOCKER_README.md` for Docker and docker-compose workflows (development and production builds).

Common Commands

- Reindex search (when OpenSearch is running):
  - `bin/rails searchkick:reindex:all`
- Seed data:
  - `bin/rails db:seed`
- Lint TypeScript types:
  - `yarn ts-check`

Notes

- Search features require OpenSearch to be available. If you are not running OpenSearch locally, disable or avoid search paths during development.
- For asset styles in development, keep the Tailwind watch process running if you edit CSS.


