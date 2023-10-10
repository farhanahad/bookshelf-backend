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
exports.saveBase64Image = exports.isBase64Image = void 0;
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config"));
const writeFileAsync = (0, util_1.promisify)(fs_1.default.writeFile);
const isBase64Image = (str) => {
    const regex = /^data:(image|text)\/(jpeg|jpg|png|gif|html);base64,/;
    return regex.test(str);
};
exports.isBase64Image = isBase64Image;
const saveBase64Image = (base64Image) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Decode base64 image data
        const decodedImage = Buffer.from(base64Image, 'base64');
        // Generate a unique filename using UUID
        const filename = `${(0, uuid_1.v4)()}.png`;
        // Define the path to save the image
        const imagePath = path_1.default.join(__dirname, '../images', filename);
        yield writeFileAsync(imagePath, decodedImage); // Use await here
        // Create a URL pointing to the saved image
        const imageUrl = `http://localhost:${config_1.default.port}/images/${filename}`;
        return imageUrl;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.EXPECTATION_FAILED, 'Failed to save the image❗');
    }
});
exports.saveBase64Image = saveBase64Image;
