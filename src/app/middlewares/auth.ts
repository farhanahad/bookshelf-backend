import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import { User } from '../modules/user/user.model';
import { Book } from '../modules/book/book.model';

const auth = () => async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get authorization token
    const token = req.headers.authorization;

    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    // Verify token
    let verifiedUser = null;

    try {
      verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.access_secret as Secret
      );
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Token has expired!');
    }

    req.user = verifiedUser;

    // Fetch the user's ID from the database based on their email
    const user = await User.findOne({ email: verifiedUser.email });

    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
    }

    // Check if the logged-in user's ID matches the seller's ID in the request body
    if (
      req.method === 'POST' &&
      req.baseUrl === '/api/v1/books' &&
      req.body.seller &&
      user._id.toString() !== req.body.seller.toString()
    ) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "You're not authorized to insert a new book"
      );
    } else if (
      (req.method === 'PATCH' || req.method === 'DELETE') &&
      req.baseUrl === '/api/v1/books'
    ) {
      const bookId = req.params.id;
      const book = await Book.findOne({ _id: bookId });
      if (book && user._id.toString() !== book.seller.toString()) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          "You're not authorized to update/delete this book!"
        );
      } else if (!book) {
        throw new ApiError(httpStatus.NOT_FOUND, 'The book is not found!');
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default auth;
