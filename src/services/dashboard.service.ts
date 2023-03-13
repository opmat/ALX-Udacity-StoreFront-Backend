import Client from '../database';
import { Product } from '../models/products';

export type ProductSold = Product & {
  total_sold: number;
};

export type RecentOrder = Product & {
  quantity: number;
  order_date: Date;
};

export class DashboardService {
  async getTopProducts(limit = 5): Promise<ProductSold[]> {
    try {
      limit = limit <= 0 ? 5 : limit;
      const conn = await Client.connect();
      const sql = `SELECT p.id, p.product_name, p.price, p.category, SUM(od.quantity) AS 'total_sold'
            FROM products p
            LEFT JOIN order_details od ON p.id = od.product_id
            GROUP BY p.id
            ORDER BY total_sold DESC
            LIMIT ${limit}`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw `An error occured ${err}: Unable to fetch Top ${limit} products`;
    }
  }
}
