import { Schema, model } from 'mongoose';
import { BookModel, IBook } from './book.interface'; // Import IBook and IReview interfaces
import { genres } from './book.constant';

const ReviewSchema = new Schema(
  {
    rating: {
      type: Number,
      required: true,
    },
    reviewText: {
      type: String,
      required: true,
    },
  },
  {
    _id: false, // Disable automatic creation of _id
  }
);

const BookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
    author: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      enum: genres,
      required: true,
    },
    publicationDate: {
      type: String,
      required: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
    },
    reviews: [ReviewSchema], // Use the ReviewSchema to define the reviews array
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Book = model<IBook, BookModel>('Book', BookSchema);
