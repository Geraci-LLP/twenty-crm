# Geraci CRM - Railway Deployment Image
# Wraps the built twenty server image, bypasses S6, runs entrypoint directly

FROM ghcr.io/geraci-llp/twenty-crm:latest AS base

FROM node:24-alpine

RUN apk add --no-cache curl jq postgresql-client

WORKDIR /app/packages/twenty-server

# Copy everything from the built image
COPY --from=base /app /app

# Copy the entrypoint script and make it executable
COPY packages/twenty-docker/twenty/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Use Twenty's own entrypoint (handles migrations, cache flush, upgrade)
# then start the server
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "dist/main"]
