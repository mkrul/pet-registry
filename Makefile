.PHONY: help build up down logs shell console test clean reset

# Docker commands for Pet Registry application

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'

build: ## Build all Docker images
	docker-compose build

attach: ## Start all services and attach to web container
	REINDEX=1 docker-compose up -d
	@echo "⏳ Waiting for services to be ready..."
	@sleep 5
	@echo "🔗 Attaching to web container..."
	docker-compose attach web

up-d: ## Start all services in background
	docker-compose up -d

down: ## Stop all services
	docker-compose down

logs: ## View logs from all services
	docker-compose logs -f

logs-web: ## View logs from web service
	docker-compose logs -f web

shell: ## Access Rails container shell
	docker-compose exec web bash

restartweb: ## Restart web container and attach to it
	docker-compose restart web
	@echo "⏳ Waiting for web container to be ready..."
	@sleep 3
	@echo "🔗 Attaching to web container..."
	docker-compose attach web

console: ## Access Rails console
	docker-compose exec web bundle exec rails console

test: ## Run RSpec tests
	docker-compose exec web bundle exec rspec

test-js: ## Run JavaScript tests
	docker-compose exec web yarn test

migrate: ## Run database migrations
	docker-compose exec web bundle exec rails db:migrate

creds:
	docker-compose exec web bundle exec rails credentials:edit

seed: ## Run database seeds
	docker-compose exec web bundle exec rails db:seed

reset: ## Reset database (WARNING: destroys all data)
	docker-compose exec web bundle exec rails db:drop db:create db:migrate db:seed

reindex: ## Reindex search
	docker-compose exec web bundle exec rails searchkick:reindex:all

clean: ## Remove all containers and volumes (WARNING: destroys all data)
	docker-compose down -v

prune: ## Clean up Docker system
	docker system prune -a

# Production commands
prod-up: ## Start production services
	docker-compose -f docker-compose.prod.yml up -d

prod-down: ## Stop production services
	docker-compose -f docker-compose.prod.yml down

prod-logs: ## View production logs
	docker-compose -f docker-compose.prod.yml logs -f

prod-build: ## Build production images
	docker-compose -f docker-compose.prod.yml build

# Development workflow
dev: ## Start development environment
	@echo "Starting development environment..."
	@echo "This will start Rails, PostgreSQL, Redis, OpenSearch, Vite, and CSS watcher"
	docker-compose up

dev-rebuild: ## Rebuild and start development environment
	docker-compose up --build

# Health checks
health: ## Check health of all services
	@echo "Checking service health..."
	@docker-compose ps

# Backup and restore
backup-db: ## Backup database
	docker-compose exec postgres pg_dump -U postgres pet_registry_development > backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "Database backed up to backup_$(shell date +%Y%m%d_%H%M%S).sql"

# Quick setup for new developers
setup: ## Initial setup for new developers
	@echo "Setting up Pet Registry for development..."
	@if [ ! -f .env ]; then \
		cp env.docker.example .env; \
		echo "Created .env file from template. Please edit it with your actual values."; \
	fi
	docker-compose build
	docker-compose up -d postgres redis opensearch
	@echo "Waiting for services to be ready..."
	sleep 10
	docker-compose up -d web
	@echo "Waiting for Rails to start..."
	sleep 5
	docker-compose exec web bundle exec rails db:prepare
	docker-compose exec web bundle exec rails db:seed
	docker-compose exec web bundle exec rails searchkick:reindex:all --trace
	@echo "Setup complete! Run 'make dev' to start all development services."
