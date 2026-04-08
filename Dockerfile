# Geraci CRM - Railway Deployment Image
# Wraps the built twenty server image with no entrypoint

FROM ghcr.io/geraci-llp/twenty-crm:latest AS base

FROM node:24-slim

RUN apt-get update && apt-get install -y --no-install-recommends curl jq postgresql-client && rm -rf /var/lib/apt/lists/*

WORKDIR /app/packages/twenty-server

# Copy everything from the built image
COPY --from=base /app /app

# No entrypoint - Railway controls the start command
CMD ["node", "dist/main"]
