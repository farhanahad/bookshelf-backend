/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

type IGenre =
  | 'Fiction'
  | 'Non-Fiction'
  | 'Mystery'
  | 'Thriller'
  | 'Science Fiction'
  | 'Fantasy'
  | 'Horror'
  | 'Romance'
  | 'Adventure'
  | 'Historical Fiction'
  | 'Biography'
  | 'Autobiography'
  | 'Self-Help'
  | 'Poetry'
  | 'Comedy'
  | 'Drama'
  | 'Action'
  | 'Crime'
  | 'Children'
  | 'Young Adult'
  | 'Graphic Novel'
  | 'Cookbook'
  | 'Travel'
  | 'Science'
  | 'History'
  | 'Philosophy'
  | 'Religion'
  | 'Art'
  | 'Music'
  | 'Sports'
  | 'Health'
  | 'Business'
  | 'Technology'
  | 'Education';

type IStatus = 'Not Started' | 'Reading' | 'Completed';

export type IReview = {
  rating: number;
  reviewText: string;
};

export type IBook = {
  image?: string;
  title: string;
  author: string;
  genre: IGenre;
  publicationDate: string;
  seller: Types.ObjectId | IUser;
  status?: IStatus;
  reviews?: IReview[];
};

export type IBookFilters = {
  q?: string;
  searchTerm?: string;
  title?: string;
  author?: string;
  genre?: IGenre;
  publicationDate?: string;
};

export type BookModel = Model<IBook, Record<string, unknown>>;
