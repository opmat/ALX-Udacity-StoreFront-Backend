import { Request, Response, Router } from 'express';
import { Product, ProductStore } from '../models/products';
import { DashboardService } from '../services/dashboard.service';
import dotenv from 'dotenv';
import verifyToken from '../middlewares/verifyToken';

dotenv.config();

const store = new ProductStore();
const dashboardService = new DashboardService();
const productRouter = Router();

const index = async (_req: Request, res: Response) => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (error) {
    res.status(400).json(error);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const product = await store.show(Number(req.params.id));
    res.json(product);
  } catch (error) {
    res.status(400).json(error);
  }
};

const create = async (req: Request, res: Response) => {
  const product: Product = {
    product_name: req.body.product_name,
    price: req.body.price,
    category: req.body.category
  };

  try {
    const newProduct = await store.create(product);
    res.json(newProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const getProductByCategory = async (req: Request, res: Response) => {
  try {
    const products = await store.showByCategory(req.params.category as string);
    res.json(products);
  } catch (error) {
    res.status(400).json(error);
  }
};

const getTopProducts = async (req: Request, res: Response) => {
  try {
    const limit = req.params.limit === undefined ? 0 : Number(req.params.limit);
    const products = await dashboardService.getTopProducts(limit);
    res.json(products);
  } catch (error) {
    res.status(400).json(error);
  }
};

productRouter.post('/prduct', verifyToken, create);
productRouter.get('/', index);
productRouter.get('/:id', show);
productRouter.get('/category/:category', getProductByCategory);
productRouter.get('/top/:limit?', getTopProducts);

export default productRouter;
