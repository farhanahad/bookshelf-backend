/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
      //   cow: JwtPayload;
      //   orders: JwtPayload;
      //   order: JwtPayload;
    }
  }
}
