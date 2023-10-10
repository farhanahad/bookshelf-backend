import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { IBook } from './book.interface';
import httpStatus from 'http-status';
import sendResponse from '../../../shared/responseData';
import { BookService } from './book.service';
import pick from '../../../shared/pick';
import { BookFilterableFields } from './book.constant';
import { paginationFields } from '../../../constants/pagination';
import ApiError from '../../../errors/ApiError';

const insertBookToDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ...bookData } = await req.body;

      const result = await BookService.insertBook(bookData);

      // console.log('result::', result);

      sendResponse<IBook>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Book inserted successfully',
        data: result,
      });
    } catch (error) {
      const apiError = error as ApiError; // Cast the error to ApiError type
      next(apiError);
    }
  }
);

const getAllBooksFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, BookFilterableFields);

  const paginationOptions = pick(req.query, paginationFields);

  const result = await BookService.getAllBooks(filters, paginationOptions);

  sendResponse<IBook[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Books successfully retrieved',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleBookFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BookService.getSingleBook(id);

  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book retrieved successfully',
    data: result,
  });
});

const updateBookFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;

  delete updatedData.seller;

  const result = await BookService.updateBook(id, updatedData);

  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book updated successfully',
    data: result,
  });
});

const deleteBookFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BookService.deleteBook(id);

  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book deleted successfully',
    data: result,
  });
});

export const BookController = {
  insertBookToDB,
  // saveBookToDB,
  getAllBooksFromDB,
  getSingleBookFromDB,
  updateBookFromDB,
  deleteBookFromDB,
};
