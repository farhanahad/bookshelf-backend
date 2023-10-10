"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validationRequest_1 = __importDefault(require("../../middlewares/validationRequest"));
const book_validation_1 = require("./book.validation");
const book_controller_1 = require("./book.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post('/', (0, validationRequest_1.default)(book_validation_1.BookValidation.createBookZodSchema), (0, auth_1.default)(), book_controller_1.BookController.insertBookToDB);
router.get('/:id', book_controller_1.BookController.getSingleBookFromDB);
router.patch('/:id', (0, validationRequest_1.default)(book_validation_1.BookValidation.updateBookZodSchema), (0, auth_1.default)(), book_controller_1.BookController.updateBookFromDB);
router.delete('/:id', (0, auth_1.default)(), book_controller_1.BookController.deleteBookFromDB);
router.get('/', book_controller_1.BookController.getAllBooksFromDB);
exports.BookRoutes = router;
