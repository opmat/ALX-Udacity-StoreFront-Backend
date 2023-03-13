import Client from '../database';

// export enum orderStatus {
//     "active",
//     "complete"
// }

export type OrderStatus = 'active' | 'complete';

export type Order = {
  id?: number;
  user_id: number;
  order_status: OrderStatus;
  order_date?: Date;
};

export type OrderDetails = {
  order_id: number;
  product_id: number;
  quantity: number;
};

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM order';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get order. Error: ${err}`);
    }
  }

  async create(u: Order): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql =
        'INSERT INTO orders (user_id, order_status) \
                    VALUES($1, $2) RETURNING *';

      const result = await conn.query(sql, [u.user_id, u.order_status]);
      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(`unable to create order for user (${u.user_id}): ${err}`);
    }
  }

  async addProductToOrder(
    orderId: number,
    productId: number,
    quantity: number
  ): Promise<OrderDetails> {
    try {
      const conn = await Client.connect();
      //Confirm Order exist and it's active
      let sql = 'SELECT * FROM orders WHERE id=$1 AND order_status="active"';
      const result = await conn.query(sql, [orderId]);
      if (result.rows.length > 0) {
        //confirm if product already exist on order
        //if it exists, change quantity and don't add the product again
        //else add the product to order
        sql = `SELECT * FROM order_details WHERE order_id=$1 AND product_id=$2`;
        const result1 = await conn.query(sql, [orderId, productId]);
        if (result1.rows.length > 0) {
          //already exists
          if (quantity <= 0) {
            const results = await this.removeProductFromOrder(
              orderId,
              productId
            );
            return results;
          } else {
            const results = await this.updateProductQuantity(
              orderId,
              productId,
              quantity
            );
            return results;
          }
        } else {
          sql = `INSERT INTO order_details (order_id, product_id, quantity) 
                        VALUES ($1, $2, $3) RETURNING *`;
          const results = await conn.query(sql, [orderId, productId, quantity]);
          conn.release();
          return results.rows[0];
        }
      } else {
        throw new Error(
          `unable to add product (${productId}) to order (${orderId}): Order not active`
        );
      }
    } catch (err) {
      throw new Error(
        `unable to add product (${productId}) to order (${orderId}): ${err}`
      );
    }
  }

  async removeProductFromOrder(
    orderId: number,
    productId: number
  ): Promise<OrderDetails> {
    try {
      const conn = await Client.connect();
      const sql = `DELETE FROM order_details 
                            WHERE product_id=$1 AND order_id=$2  RETURNING *`;
      const results = await conn.query(sql, [productId, orderId]);
      conn.release();
      return results.rows[0];
    } catch (err) {
      throw new Error(
        `unable to remove product (${productId}) from order (${orderId}): ${err}`
      );
    }
  }

  async updateProductQuantity(
    orderId: number,
    productId: number,
    quantity: number
  ): Promise<OrderDetails> {
    try {
      const conn = await Client.connect();
      const sql = `UPDATE order_details SET quantity=$1 
                            WHERE product_id=$2 AND order_id=$3  RETURNING *`;
      const results = await conn.query(sql, [quantity, productId, orderId]);
      conn.release();
      return results.rows[0];
    } catch (err) {
      throw new Error(
        `unable to remove product (${productId}) from order (${orderId}): ${err}`
      );
    }
  }

  async show(id: number): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders WHERE id=$1';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw `An error occured ${err}`;
    }
  }

  async showUserOrders(
    userId: number,
    orderStatus = '',
    limit = 5
  ): Promise<Order[]> {
    try {
      limit = limit <= 0 ? 5 : limit;
      const conn = await Client.connect();
      let sql: string;
      // let result:Client.QueryResult
      if (orderStatus === '') {
        sql = `SELECT * FROM orders WHERE user_id=$1 
                        ORDER BY order_date DESC LIMIT ${limit}`;
        const result = await conn.query(sql, [userId]);
        conn.release();
        return result.rows;
      } else {
        sql = `SELECT * FROM orders WHERE user_id=$1 AND order_status=$2 
                        ORDER BY order_date DESC LIMIT ${limit}`;
        const result = await conn.query(sql, [userId, orderStatus]);
        conn.release();
        return result.rows;
      }
    } catch (err) {
      throw `An error occured ${err}`;
    }
  }

  async showByStatus(ostatus: string): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders WHERE order_status=$1';
      const result = await conn.query(sql, [ostatus]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw `An error occured ${err}: Unable to fetch Order with status ${ostatus}`;
    }
  }

  async delete(id: number) {
    try {
      const conn = await Client.connect();
      const sql =
        'DELETE FROM orders \
                WHERE id=$1';
      const results = await conn.query(sql, [id]);
      conn.release();
      return `Order with ID ${results.rows[0].id} deleted`;
    } catch (err) {
      throw `An error occured ${err}`;
    }
  }
}
