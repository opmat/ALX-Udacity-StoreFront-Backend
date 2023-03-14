import { Request, Response, Router } from 'express';
import { User, UserStore } from '../models/users';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import verifyToken from '../middlewares/verifyToken';
import { OrderStore } from '../models/orders';

dotenv.config();

const store = new UserStore();
const orderStore = new OrderStore();
const userRouter = Router();

const index = async (_req: Request, res: Response) => {
  try {
    const users = await store.index();
    res.status(200).json(users);
  } catch (error) {
    res.status(401).json(error);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const user = await store.show(Number(req.params.id));
    const recentOrders = await orderStore.showUserOrders(
      Number(req.params.id),
      '',
      5
    );
    res.json([{ userinfo: user, recentorders: recentOrders }]);
  } catch (error) {
    res.status(400).json(error);
  }
};

const create = async (req: Request, res: Response) => {
  const user: User = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password
  };

  try {
    const newUser = await store.create(user);
    const token = jwt.sign(
      {
        user: {
          id: newUser.id,
          firstname: newUser.firstname,
          lastname: newUser.lastname,
          email: newUser.email
        }
      },
      process.env.TOKEN_SECRET as jwt.Secret,
      {
        expiresIn: '4h'
      }
    );
    res.status(200).json({ token });
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const user = await store.getUserByEmail(req.params.email as string);
    res.json(user);
  } catch (error) {
    res.status(400).json(error);
  }
};

const updatePassword = async (req: Request, res: Response) => {
  try {
    const user = await store.changePassword(
      req.body.email as string,
      req.body.oldpassword as string,
      req.body.newPassword as string
    );
    res.json(user);
  } catch (error) {
    res.status(400).json(error);
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    const user = await store.authenticate(
      req.body.email as string,
      req.body.password as string
    );
    if (user) {
      //authenticated
      const token = jwt.sign({ user }, process.env.TOKEN_SECRET as jwt.Secret, {
        expiresIn: '4h'
      });
      res.status(200).json({ token });
    } else {
      //unauthenticated
      res.status(401).json('Invalid credentials');
    }
    // res.json(user);
  } catch (error) {
    res.status(400).json(error);
  }
};

// router.use(verifyToken);

userRouter.post('/login', authenticate);
userRouter.post('/', create);
userRouter.post('/changepass/:id', verifyToken, updatePassword);
userRouter.get('/', verifyToken, index);
userRouter.get('/:id', verifyToken, show);
userRouter.get('/:email', verifyToken, getUserByEmail);

export default userRouter;
