/* eslint-disable @typescript-eslint/no-explicit-any */
import { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IGenericPagination } from '../../../interfaces/common';
import { IPagination } from '../../../interfaces/pagination';
import { IBook, IBookFilters } from './book.interface';
import { Book } from './book.model';
import { BookSearchableFields } from './book.constant';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

// import { isBase64Image, saveBase64Image } from '../../../shared/functions';

const insertBook = async (book: IBook): Promise<IBook | null> => {
  try {
    if (book.image) {
      // Create a URL pointing to the saved image
      // const imageUrl = await saveBase64Image(book.image);

      // console.log('Coverted Url', imageUrl);
      book = {
        ...book,
        image: book.image,
        status: 'Not Started',
      };

      const result = (await Book.create(book)).populate('seller');
      return result;
    } else {
      book = {
        ...book,
        status: 'Not Started',
      };
      const result = (await Book.create(book)).populate('seller');
      return result;
    }
  } catch (error) {
    if ((error as any).code === 11000) {
      // Duplicate key error (if title is not unique)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Title must be unique❗');
    }
    throw error;
  }
};

const getAllBooks = async (
  filters: IBookFilters,
  paginationOptions: IPagination
): Promise<IGenericPagination<IBook[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePaginations(paginationOptions);

  const { searchTerm, q, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm || q) {
    andConditions.push({
      $or: BookSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm || q,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Book.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Book.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleBook = async (id: string): Promise<IBook | null> => {
  const result = await Book.findById(id).populate({ path: 'seller' });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'The book is not found❗');
  }

  return result;
};

const updateBook = async (
  id: string,
  payload: Partial<IBook>
): Promise<IBook | null> => {
  try {
    // const { image } = payload;

    // if (image && isBase64Image(image)) {
    //   payload.image = await saveBase64Image(image);
    // }

    const result = await Book.findOneAndUpdate({ _id: id }, payload, {
      new: true,
    }).populate('seller');

    return result;
  } catch (error) {
    if ((error as any).code === 11000) {
      // Duplicate key error (if title is not unique)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Title must be unique❗');
    }
    throw error;
  }
};

const deleteBook = async (id: string): Promise<IBook | null> => {
  const result = await Book.findByIdAndDelete(id);
  return result;
};

export const BookService = {
  insertBook,
  getAllBooks,
  getSingleBook,
  updateBook,
  deleteBook,
};
