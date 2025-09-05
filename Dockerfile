# Multi-stage Dockerfile for Rails + React application

# Base stage with common dependencies
FROM ruby:3.3.3-slim AS base

# Install system dependencies
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    build-essential \
    curl \
    git \
    libpq-dev \
    libvips \
    pkg-config \
    && rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Install Node.js and Yarn
ARG NODE_VERSION=18.20.1
ARG YARN_VERSION=1.22.19
ENV PATH=/usr/local/node/bin:$PATH
RUN curl -sL https://github.com/nodenv/node-build/archive/master.tar.gz | tar xz -C /tmp/ && \
    /tmp/node-build-master/bin/node-build "${NODE_VERSION}" /usr/local/node && \
    npm install -g yarn@$YARN_VERSION && \
    rm -rf /tmp/node-build-master

# Set working directory
WORKDIR /app

# Development stage
FROM base AS development

# Install development dependencies
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    postgresql-client \
    vim-tiny \
    && rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy dependency files
COPY Gemfile Gemfile.lock ./
COPY package.json yarn.lock ./

# Install Ruby gems
RUN bundle install

# Install Node.js packages
RUN yarn install

# Copy application code
COPY . .

# Expose ports
EXPOSE 3000 5173

# Default command for development
CMD ["bash", "-c", "rm -f tmp/pids/server.pid && bundle exec rails server -b '0.0.0.0'"]

# Production build stage
FROM base AS build

# Set production environment
ENV RAILS_ENV="production" \
    NODE_ENV="production" \
    BUNDLE_DEPLOYMENT="1" \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_WITHOUT="development:test"

# Copy dependency files
COPY Gemfile Gemfile.lock ./
COPY package.json yarn.lock ./

# Install production gems
RUN bundle install && \
    rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git && \
    bundle exec bootsnap precompile --gemfile

# Install Node.js packages
RUN yarn install --frozen-lockfile --production=false

# Copy application code
COPY . .

# Precompile bootsnap code for faster boot times
RUN bundle exec bootsnap precompile app/ lib/

# Build assets
RUN SECRET_KEY_BASE_DUMMY=1 ./bin/rails assets:precompile

# Remove node_modules to reduce image size
RUN rm -rf node_modules

# Production stage
FROM base AS production

# Set production environment
ENV RAILS_ENV="production" \
    BUNDLE_DEPLOYMENT="1" \
    BUNDLE_PATH="/usr/local/bundle"

# Install production system dependencies
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Create rails user for security
RUN groupadd --system --gid 1000 rails && \
    useradd rails --uid 1000 --gid 1000 --create-home --shell /bin/bash

# Copy built artifacts from build stage
COPY --from=build --chown=rails:rails "${BUNDLE_PATH}" "${BUNDLE_PATH}"
COPY --from=build --chown=rails:rails /app /app

# Change ownership of application directories
RUN chown -R rails:rails /app/db /app/log /app/storage /app/tmp

# Switch to rails user
USER 1000:1000

# Set working directory
WORKDIR /app

# Copy and set up entrypoint
COPY --chown=rails:rails ./bin/docker-entrypoint /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint
ENTRYPOINT ["docker-entrypoint"]

# Expose port
EXPOSE 3000

# Start the server
CMD ["./bin/rails", "server", "-b", "0.0.0.0"]

# # syntax = docker/dockerfile:1

# # This Dockerfile is designed for production, not development. Use with Kamal or build'n'run by hand:
# # docker build -t my-app .
# # docker run -d -p 80:80 -p 443:443 --name my-app -e RAILS_MASTER_KEY=<value from config/master.key> my-app

# # Make sure RUBY_VERSION matches the Ruby version in .ruby-version
# ARG RUBY_VERSION=3.1.0
# FROM docker.io/library/ruby:$RUBY_VERSION-slim AS base

# # Rails app lives here
# WORKDIR /rails

# # Install base packages
# RUN apt-get update -qq && \
#     apt-get install --no-install-recommends -y curl libjemalloc2 libvips postgresql-client && \
#     rm -rf /var/lib/apt/lists /var/cache/apt/archives

# # Set production environment
# ENV RAILS_ENV="production" \
#     BUNDLE_DEPLOYMENT="1" \
#     BUNDLE_PATH="/usr/local/bundle" \
#     BUNDLE_WITHOUT="development"

# # Throw-away build stage to reduce size of final image
# FROM base AS build

# # Install packages needed to build gems and node modules
# RUN apt-get update -qq && \
#     apt-get install --no-install-recommends -y build-essential git libpq-dev node-gyp pkg-config python-is-python3 && \
#     rm -rf /var/lib/apt/lists /var/cache/apt/archives

# # Install JavaScript dependencies
# ARG NODE_VERSION=18.20.1
# ARG YARN_VERSION=1.22.19
# ENV PATH=/usr/local/node/bin:$PATH
# RUN curl -sL https://github.com/nodenv/node-build/archive/master.tar.gz | tar xz -C /tmp/ && \
#     /tmp/node-build-master/bin/node-build "${NODE_VERSION}" /usr/local/node && \
#     npm install -g yarn@$YARN_VERSION && \
#     rm -rf /tmp/node-build-master

# # Install application gems
# COPY Gemfile Gemfile.lock ./
# RUN bundle install && \
#     rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git && \
#     bundle exec bootsnap precompile --gemfile

# # Install node modules
# COPY package.json yarn.lock ./
# RUN yarn install --frozen-lockfile

# # Copy application code
# COPY . .

# # Precompile bootsnap code for faster boot times
# RUN bundle exec bootsnap precompile app/ lib/

# # Precompiling assets for production without requiring secret RAILS_MASTER_KEY
# RUN SECRET_KEY_BASE_DUMMY=1 ./bin/rails assets:precompile


# RUN rm -rf node_modules


# # Final stage for app image
# FROM base

# # Copy built artifacts: gems, application
# COPY --from=build "${BUNDLE_PATH}" "${BUNDLE_PATH}"
# COPY --from=build /rails /rails

# # Run and own only the runtime files as a non-root user for security
# RUN groupadd --system --gid 1000 rails && \
#     useradd rails --uid 1000 --gid 1000 --create-home --shell /bin/bash && \
#     chown -R rails:rails db log storage tmp
# USER 1000:1000

# # Entrypoint prepares the database.
# ENTRYPOINT ["/rails/bin/docker-entrypoint"]

# # Start the server by default, this can be overwritten at runtime
# EXPOSE 3000
# CMD ["./bin/rails", "server"]
