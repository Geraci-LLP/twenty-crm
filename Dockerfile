# Geraci CRM - Railway Deployment Image
# Wraps the built twenty server image with no entrypoint

FROM ghcr.io/geraci-llp/twenty-crm:latest AS base

FROM node:24-alpine

RUN apk add --no-cache curl jq postgresql-client

WORKDIR /app/packages/twenty-server

# Copy everything from the built image
COPY --from=base /app /app

# No entrypoint - Railway controls the start command
CMD ["node", "dist/main"]
