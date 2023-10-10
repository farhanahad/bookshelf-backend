"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = require("mongoose");
const book_constant_1 = require("./book.constant");
const ReviewSchema = new mongoose_1.Schema({
    rating: {
        type: Number,
        required: true,
    },
    reviewText: {
        type: String,
        required: true,
    },
}, {
    _id: false, // Disable automatic creation of _id
});
const BookSchema = new mongoose_1.Schema({
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
        enum: book_constant_1.genres,
        required: true,
    },
    publicationDate: {
        type: String,
        required: true,
    },
    seller: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
    },
    reviews: [ReviewSchema], // Use the ReviewSchema to define the reviews array
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Book = (0, mongoose_1.model)('Book', BookSchema);
