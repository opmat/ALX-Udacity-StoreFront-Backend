#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
    GRANT ALL PRIVILEGES ON DATABASE storefront_dev TO alxtest;
    DROP DATABASE storefront_test IF EXISTS;
    CREATE DATABASE storefront_test;
    GRANT ALL PRIVILEGES ON DATABASE storefront_test TO alxtest;
    COMMENT ON DATABASE storefront_dev
        IS 'the main storefront database';
    COMMENT ON DATABASE storefront_test
        IS 'the storefront test database';
EOSQL
