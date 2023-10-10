"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookValidation = void 0;
const zod_1 = require("zod");
const book_constant_1 = require("./book.constant");
const createBookZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        image: zod_1.z.string({
            required_error: 'Image is required!',
        }),
        // image: typeof window === 'undefined' ? z.any() : z.instanceof(File),
        title: zod_1.z.string({
            required_error: 'Title is required!',
        }),
        author: zod_1.z.string({
            required_error: 'Author is required!',
        }),
        genre: zod_1.z.enum([...book_constant_1.genres], {
            required_error: 'Genre is required!',
        }),
        publicationDate: zod_1.z.string({
            required_error: 'Publication date is required!',
        }),
        seller: zod_1.z.string({
            required_error: 'Seller is required',
        }),
        status: zod_1.z.enum([...book_constant_1.status]).optional(),
        reviews: zod_1.z
            .array(zod_1.z
            .object({
            rating: zod_1.z.number().optional(),
            // rating: z.number().int({ message: 'Rating must be an integer' }),
            reviewText: zod_1.z.string().optional(),
        })
            .optional())
            .optional(),
    }),
});
const updateBookZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        image: zod_1.z.string().optional(),
        title: zod_1.z.string().optional(),
        author: zod_1.z.string().optional(),
        genre: zod_1.z.enum([...book_constant_1.genres]).optional(),
        publicationDate: zod_1.z.string().optional(),
        status: zod_1.z.enum([...book_constant_1.status]).optional(),
        reviews: zod_1.z
            .array(zod_1.z.object({
            rating: zod_1.z
                .number()
                .int({ message: 'Rating must be an integer' })
                .optional(),
            reviewText: zod_1.z.string().optional(),
        }))
            .optional(),
    }),
});
exports.BookValidation = { createBookZodSchema, updateBookZodSchema };
