import { z } from 'zod';
import { genres, status } from './book.constant';

const createBookZodSchema = z.object({
  body: z.object({
    image: z.string({
      required_error: 'Image is required!',
    }),
    // image: typeof window === 'undefined' ? z.any() : z.instanceof(File),
    title: z.string({
      required_error: 'Title is required!',
    }),
    author: z.string({
      required_error: 'Author is required!',
    }),
    genre: z.enum([...genres] as [string, ...string[]], {
      required_error: 'Genre is required!',
    }),
    publicationDate: z.string({
      required_error: 'Publication date is required!',
    }),
    seller: z.string({
      required_error: 'Seller is required',
    }),
    status: z.enum([...status] as [string, ...string[]]).optional(),
    reviews: z
      .array(
        z
          .object({
            rating: z.number().optional(),
            // rating: z.number().int({ message: 'Rating must be an integer' }),
            reviewText: z.string().optional(),
          })
          .optional()
      )
      .optional(),
  }),
});

const updateBookZodSchema = z.object({
  body: z.object({
    image: z.string().optional(),
    title: z.string().optional(),
    author: z.string().optional(),
    genre: z.enum([...genres] as [string, ...string[]]).optional(),
    publicationDate: z.string().optional(),
    status: z.enum([...status] as [string, ...string[]]).optional(),
    reviews: z
      .array(
        z.object({
          rating: z
            .number()
            .int({ message: 'Rating must be an integer' })
            .optional(),
          reviewText: z.string().optional(),
        })
      )
      .optional(),
  }),
});

export const BookValidation = { createBookZodSchema, updateBookZodSchema };
