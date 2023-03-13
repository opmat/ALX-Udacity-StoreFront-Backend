import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import userRouter from './handlers/users.route';
import productRouter from './handlers/products.route';
import orderRouter from './handlers/orders.route';

dotenv.config();

const app: Application = express();
const address = `${process.env.SERVER_ADDRESS}:${process.env.SERVER_PORT}`;

app.use(bodyParser.json());

app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/orders', orderRouter);

app.get('/', function (req: Request, res: Response) {
  res.send('Welcome!');
});

app.listen(process.env.SERVER_PORT, function () {
  console.log(`starting app on: ${address}`);
});
