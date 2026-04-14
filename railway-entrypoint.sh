#!/bin/sh
set -e

cd /app/packages/twenty-server

setup_and_migrate_db() {
    if [ "${DISABLE_DB_MIGRATIONS}" = "true" ]; then
        echo "Database setup and migrations are disabled, skipping..."
        return
    fi

    echo "Running database setup and migrations..."

    has_schema=$(psql -tAc "SELECT EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'core')" ${PG_DATABASE_URL})
    if [ "$has_schema" = "f" ]; then
        echo "Database appears to be empty, running full init."
        node dist/database/scripts/setup-db.js
        node dist/command/command run-instance-commands --force
    fi

    echo "Running TypeORM migrations and instance commands..."
    node dist/command/command run-instance-commands --force
    node dist/command/command cache:flush
    echo "Syncing standard metadata (creates missing standard objects)..."
    node dist/command/command workspace:sync-standard-metadata
    node dist/command/command cache:flush
    node dist/command/command upgrade
    node dist/command/command cache:flush

    echo "Successfully migrated DB!"
}

register_background_jobs() {
    if [ "${DISABLE_CRON_JOBS_REGISTRATION}" = "true" ]; then
        echo "Cron job registration is disabled, skipping..."
        return
    fi

    echo "Registering background sync jobs..."
    if node dist/command/command cron:register:all; then
        echo "Successfully registered all background sync jobs!"
    else
        echo "Warning: Failed to register background jobs, but continuing startup..."
    fi
}

setup_and_migrate_db
register_background_jobs

echo "Starting Twenty CRM server..."
exec "$@"
