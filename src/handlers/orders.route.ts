import { Request, Response, Router } from 'express';
import { Order, OrderStore } from '../models/orders';
import dotenv from 'dotenv';
import verifyToken from '../middlewares/verifyToken';

dotenv.config();

const store = new OrderStore();
const orderRouter = Router();

const index = async (_req: Request, res: Response) => {
  try {
    const orders = await store.index();
    res.json(orders);
  } catch (error) {
    res.status(400).json(error);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const order = await store.show(Number(req.params.id));
    res.json(order);
  } catch (error) {
    res.status(400).json(error);
  }
};

const create = async (req: Request, res: Response) => {
  const order: Order = {
    user_id: req.body.user_id,
    order_status: 'active'
  };

  try {
    const newOrder = await store.create(order);
    res.json(newOrder);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const addProductToOrder = async (req: Request, res: Response) => {
  try {
    const products = await store.addProductToOrder(
      req.body.orderId as number,
      req.body.productId as number,
      req.body.quantity as number
    );
    res.json(products);
  } catch (error) {
    res.status(400).json(error);
  }
};

const showCurrentOrder = async (req: Request, res: Response) => {
  try {
    const limit = req.params.limit === undefined ? 1 : Number(req.params.limit);
    const order = await store.showUserOrders(
      Number(req.params.userid),
      'active',
      limit
    );
    res.json(order);
  } catch (error) {
    res.status(400).json(error);
  }
};

const showCompletedOrder = async (req: Request, res: Response) => {
  try {
    const limit = req.params.limit === undefined ? 0 : Number(req.params.limit);
    const order = await store.showUserOrders(
      Number(req.params.userid),
      'complete',
      limit
    );
    res.json(order);
  } catch (error) {
    res.status(400).json(error);
  }
};

orderRouter.post('/', verifyToken, create);
orderRouter.post('/addproduct', verifyToken, addProductToOrder);
orderRouter.get('/', index);
orderRouter.get('/:id', show);
orderRouter.get('/user/:userid/active/:limit?', verifyToken, showCurrentOrder);
orderRouter.get(
  '/user/:userid/complete/:limit?',
  verifyToken,
  showCompletedOrder
);

export default orderRouter;
