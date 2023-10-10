"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookService = void 0;
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const book_model_1 = require("./book.model");
const book_constant_1 = require("./book.constant");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
// import { isBase64Image, saveBase64Image } from '../../../shared/functions';
const insertBook = (book) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (book.image) {
            // Create a URL pointing to the saved image
            // const imageUrl = await saveBase64Image(book.image);
            // console.log('Coverted Url', imageUrl);
            book = Object.assign(Object.assign({}, book), { image: book.image, status: 'Not Started' });
            const result = (yield book_model_1.Book.create(book)).populate('seller');
            return result;
        }
        else {
            book = Object.assign(Object.assign({}, book), { status: 'Not Started' });
            const result = (yield book_model_1.Book.create(book)).populate('seller');
            return result;
        }
    }
    catch (error) {
        if (error.code === 11000) {
            // Duplicate key error (if title is not unique)
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Title must be unique❗');
        }
        throw error;
    }
});
const getAllBooks = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelpers_1.paginationHelpers.calculatePaginations(paginationOptions);
    const { searchTerm, q } = filters, filtersData = __rest(filters, ["searchTerm", "q"]);
    const andConditions = [];
    if (searchTerm || q) {
        andConditions.push({
            $or: book_constant_1.BookSearchableFields.map(field => ({
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
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield book_model_1.Book.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield book_model_1.Book.countDocuments();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_model_1.Book.findById(id).populate({ path: 'seller' });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'The book is not found❗');
    }
    return result;
});
const updateBook = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { image } = payload;
        // if (image && isBase64Image(image)) {
        //   payload.image = await saveBase64Image(image);
        // }
        const result = yield book_model_1.Book.findOneAndUpdate({ _id: id }, payload, {
            new: true,
        }).populate('seller');
        return result;
    }
    catch (error) {
        if (error.code === 11000) {
            // Duplicate key error (if title is not unique)
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Title must be unique❗');
        }
        throw error;
    }
});
const deleteBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_model_1.Book.findByIdAndDelete(id);
    return result;
});
exports.BookService = {
    insertBook,
    getAllBooks,
    getSingleBook,
    updateBook,
    deleteBook,
};
