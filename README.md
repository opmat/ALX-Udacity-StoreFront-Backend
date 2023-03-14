# Storefront Backend Project

A simple API built with Node.JS, Typescript, and Express with PostgreSQL for basic shopping cart management.

This project is based on the ALX Udacity Fullstack JS Course.

## Getting Started

This repo contains a basic Node and Express app to get you started in constructing an API. To get started, clone this repo and run `yarn` in your terminal at the project root.

## Installation

To get started, clone or downlad the repository and you can then install the project with yarn. You first `cd` into the repository directory and run `yarn` in your terminal at the project root.

```bash
  cd project-directory
  yarn
```

Next, you setup your environment variables by duplicating the `.env.sample` file and rename it as `.env`. Check the Environment Variable section for more details.

## Environment Variables

To run this project, you are required to configure the environment variables for your application by duplicating the `.env.sample` file and rename it as `.env`. Variables available in the `.env.sample` file are shown below.

```text
ENV=test
POSTGRES_HOST=localhost
POSTGRES_PORT=54321 #must-match-forwarding-port-in-docker-compose-file
POSTGRES_USER=your-postgres-username
POSTGRES_PASSWORD=your-postgres-password
POSTGRES_DB=storefront_dev #main-database-for-dev
POSTGRES_DB_TEST=storefront_test #test-database
BCRYPT_PASSWORD=something-not-easy-to-guess-or-imagine
SALT_ROUNDS=10
TOKEN_SECRET=shh-always-a-secret
PGADMIN_DEFAULT_EMAIL=admin@test.com
PGADMIN_DEFAULT_PASSWORD=t3sting
SERVER_PORT=3000
SERVER_ADDRESS=localhost
```

The `ENV` variable defines the environment in which you which to run the application and it can be `test`, `dev`, etc.
All variables prefixed by `POSTGRES_` are used to define the PostgreSQL database parameters. Since the Postgres database is running in a docker container, the `docker-compose.yml` file contains information for setting up postgres including the forwarding port. The _default forwarding port_ used in the `docker-compose.yml` file is `54321`, which is then forwarded to the default postgres port `5432` in the container. Hence, it is safe to use `54321` as `POSTGRES_PORT`.

Environment variables prefixed by `SERVER_` defines the express server parameter and can be adjusted accordingly.

## Database Setup

The postgreSQL database is designed to run as a service in a Docker container named `alxpostgresdb`. All information on the database setup is provided in the `docker-compose.yml` file.

## Running the Application/Start-up scripts

Some start-up scripts are included in the `package.json` file to run the application and other services including database setup and migration. Some of the scripts are highlighted below;

### Running Test

To run the test provided in the application, you are required to start up docker and then run the test using the following commands in your terminal

```bash
    npm run docker-start
```

Then to build and run the tests, run the following

```bash
  npm run test
```

### Running Application local

To run the test provided in the application, you are required to start up docker and then run the server using the following commands in your terminal

```bash
    npm run docker-start
```

To run the server on development mode, run the following

```bash
  npm run watch
```

## Used Technologies

The application uses the following libraries:

- PostgreSQL for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine and supertest from npm for testing
