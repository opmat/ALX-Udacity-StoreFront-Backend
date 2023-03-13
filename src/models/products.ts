import Client from '../database';

export type Product = {
  id?: number;
  product_name: string;
  price: number;
  category?: string;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get products. Error: ${err}`);
    }
  }

  async create(u: Product): Promise<Product> {
    try {
      const conn = await Client.connect();
      const sql =
        'INSERT INTO products (product_name, price, category) \
                    VALUES($1, $2, $3) RETURNING *';

      const result = await conn.query(sql, [
        u.product_name,
        u.price,
        u.category
      ]);
      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(`unable to create product (${u.product_name}): ${err}`);
    }
  }

  async show(id: number): Promise<Product> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products WHERE id=$1';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw `An error occured ${err}`;
    }
  }

  async showByCategory(category: string): Promise<Product[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products WHERE category=$1';
      const result = await conn.query(sql, [category]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw `An error occured ${err}: Unable to fetch Porduct with Category ${category}`;
    }
  }

  async delete(id: number): Promise<string> {
    try {
      const conn = await Client.connect();
      const sql =
        'DELETE FROM products \
                WHERE id=$1 RETURNING *';
      const results = await conn.query(sql, [id]);
      conn.release();
      return `Product with ID ${results.rows[0].id} deleted`;
    } catch (err) {
      throw `An error occured ${err}`;
    }
  }
}
