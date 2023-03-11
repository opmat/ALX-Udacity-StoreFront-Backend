/* Replace with your SQL commands */
CREATE TABLE order_details ( 
    id SERIAL PRIMARY KEY, 
    order_id bigint REFERENCES orders(id), 
    product_id bigint REFERENCES products(id), 
    quantity integer 
);