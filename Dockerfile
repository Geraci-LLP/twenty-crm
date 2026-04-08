# Geraci CRM - Railway Deployment Image
# Wraps the built twenty server image, runs migrations via node (not yarn)

FROM ghcr.io/geraci-llp/twenty-crm:latest AS base

FROM node:24-alpine

RUN apk add --no-cache curl jq postgresql-client

WORKDIR /app/packages/twenty-server

# Copy everything from the built image
COPY --from=base /app /app

# Copy our Railway-specific entrypoint (uses node instead of yarn)
COPY railway-entrypoint.sh /app/railway-entrypoint.sh
RUN chmod +x /app/railway-entrypoint.sh

ENTRYPOINT ["/app/railway-entrypoint.sh"]
CMD ["node", "dist/main"]
