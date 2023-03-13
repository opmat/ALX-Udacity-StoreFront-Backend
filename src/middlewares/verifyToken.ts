import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const token_secret: string = process.env.TOKEN_SECRET as unknown as string;

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader: string = req.headers
      .authorization as unknown as string;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.verify(token, token_secret);
    res.locals.decodedJWT = decoded;

    next();
  } catch (error) {
    res.status(401).send('Unauthorized Access');
  }
};

export default verifyToken;
