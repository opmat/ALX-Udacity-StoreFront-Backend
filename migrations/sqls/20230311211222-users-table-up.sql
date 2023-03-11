/* Replace with your SQL commands */
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(64) NOT NULL,
    lastname VARCHAR(64) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_digest VARCHAR NOT NULL,
    date_registered  TIMESTAMPTZ NOT NULL
        DEFAULT (current_timestamp AT TIME ZONE 'UTC')
);