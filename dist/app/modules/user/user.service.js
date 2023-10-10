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
exports.UserService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const user_model_1 = require("./user.model");
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // default password
        if (!user.password) {
            user.password = config_1.default.default_user_pass;
        }
        const createdUser = yield user_model_1.User.create(user);
        if (!createdUser) {
            throw new ApiError_1.default(400, 'Failed to create user');
        }
        // return createdUser;
        return user_model_1.User.findById(createdUser._id).select('-password').lean();
    }
    catch (error) {
        if (error.code === 11000) {
            // Duplicate key error (if emaile is not unique)
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Email must be unique');
        }
        throw error;
    }
});
exports.UserService = {
    createUser,
};
