/* Replace with your SQL commands */
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(64) NOT NULL,
    price numeric(10,2) NOT NULL,
    category VARCHAR(64)
);