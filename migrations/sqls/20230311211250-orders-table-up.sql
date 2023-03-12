/* Replace with your SQL commands */
CREATE TYPE ostatus AS ENUM ('active', 'complete');

CREATE TABLE orders ( 
    id SERIAL PRIMARY KEY, 
    user_id bigint REFERENCES users(id), 
    order_status ostatus  DEFAULT 'active',
    order_date  TIMESTAMPTZ NOT NULL
        DEFAULT (current_timestamp AT TIME ZONE 'UTC') 
); 