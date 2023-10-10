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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const jwtHelpers_1 = require("../../helpers/jwtHelpers");
const user_model_1 = require("../modules/user/user.model");
const book_model_1 = require("../modules/book/book.model");
const auth = () => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get authorization token
        const token = req.headers.authorization;
        if (!token) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized');
        }
        // Verify token
        let verifiedUser = null;
        try {
            verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.access_secret);
        }
        catch (error) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Token has expired!');
        }
        req.user = verifiedUser;
        // Fetch the user's ID from the database based on their email
        const user = yield user_model_1.User.findOne({ email: verifiedUser.email });
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'User not found');
        }
        // Check if the logged-in user's ID matches the seller's ID in the request body
        if (req.method === 'POST' &&
            req.baseUrl === '/api/v1/books' &&
            req.body.seller &&
            user._id.toString() !== req.body.seller.toString()) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "You're not authorized to insert a new book");
        }
        else if ((req.method === 'PATCH' || req.method === 'DELETE') &&
            req.baseUrl === '/api/v1/books') {
            const bookId = req.params.id;
            const book = yield book_model_1.Book.findOne({ _id: bookId });
            if (book && user._id.toString() !== book.seller.toString()) {
                throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "You're not authorized to update/delete this book!");
            }
            else if (!book) {
                throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'The book is not found!');
            }
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.default = auth;
