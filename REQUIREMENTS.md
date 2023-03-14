# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products

| Endpoint            | Verb | Token Required? | Description             |
| ------------------- | ---- | :---: | ----------------------- |
| /products/             | POST |  Yes   | Create a new product       |
| /products/             | GET  |  No   | Get the list of all products           |
| /products/:id | GET |  No   | Get a product by id    |
| /products/category/:category          | GET  |  No   | Get product list by category |
| /products/top/:limit?          | GET  |  No   | Get the list of Top _limit_ product by sales, where _limit_ is an integer and optional. _limit_ defaults to 5 |

#### Users

| Endpoint            | Verb | Token Required? | Description             |
| ------------------- | ---- | :---: | ----------------------- |
| /users/             | POST |  No   | Create a new user       |
| /users/             | GET  |  Yes   | Get the list of all users           |
| /users/login | POST |  No   | Authenticates a user     |
| /users/:id          | GET  |  Yes   | Get a user by id |

#### Orders

| Endpoint            | Verb | Token Required? | Description             |
| ------------------- | ---- | :---: | ----------------------- |
| /orders/             | POST |  Yes   | Create a new order       |
| /orders/             | GET  |  No   | Get the list of all orders           |
| /orders/:id          | GET  |  No   | Get a particular order by id |
| /orders/:id/cart | GET |  No   | Get the Cart listing for a particular order with id     |
| /orders/addproduct          | POST  |  Yes   | Add product item to an order |
| /orders/close          | POST  |  Yes   | Close an order or set the status of the order as complete |
| /user/:userid/active/:limit?          | GET  |  Yes   | Get a list of active order with size _limit_ for user with id _userid_. Where _limit_is optional and defaults to 1 |
| /user/:userid/complete/:limit?          | GET  |  Yes   | Get a list of completed orders with size _limit_ for user with id _userid_. Where _limit_is optional and defaults to 5 |

## Data Shapes
The database design is as shown in the image below.

![App Screenshot](https://ffesongl.sirv.com/ALX%20Udacity%20Projects/Project%202%20-%20Storefront%20Backend/database%20schema.png)

#### Product Table

| Field Name | Data Type | Metadata                                            |
| ---------- | --------- | --------------------------------------------------- |
| id         | Integer   | primary key, auto-increment field     |
| product_name | String (100)    | required, unique                                            |
| price  | Float    | required                                            |
| category   | String (100)   | optional                 |

#### User Table

| Field Name | Data Type | Metadata                                            |
| ---------- | --------- | --------------------------------------------------- |
| id         | Integer   | primary key, auto-increment field     |
| first_name | String    | required                                            |
| last_name  | String    | required                                            |
| email   | String    | required, unique                 |
| password_digest   | String    | required                         |
| date_registered   | Timestamp with Timezone    | Defaule: current_timestamp AT TIME ZONE 'UTC'                         |

#### Orders Table

| Field Name | Data Type | Metadata                                            |
| ---------- | --------- | --------------------------------------------------- |
| id         | Integer   | primary key, auto-increment field |
| user_id    | Integer   | required, references the id in the users table      |
| order_status     | String    | required, can either be 'active' or 'complete', defaults to 'active'                      |
| order_date   | Timestamp with Timezone    | Defaule: current_timestamp AT TIME ZONE 'UTC'                         |

### Order_Details Table

| Field Name | Data Type | Metadata                                            |
| ---------- | --------- | --------------------------------------------------- |
| id         | Integer   | primary key, auto-increment field |
| order_id   | Integer   | required, references the id in the orders table     |
| product_id | Integer   | required, references the id in the products table   |
| quantity   | Integer   | required                                            |