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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const http_status_1 = __importDefault(require("http-status"));
const routes_1 = __importDefault(require("./app/routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
// Allow requests from specific origins
const allowedOrigins = [
    'http://localhost:3000',
    'https://bookshelf-ui.vercel.app',
];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow credentials (cookies)
};
// const corsOptions = {
//   // origin: ['http://localhost:3000',],
//   origin: ['http://localhost:3000', 'https://bookshelf-ui.vercel.app'],
//   credentials: true, // Allow credentials (cookies)
// };
app.use((0, cors_1.default)(corsOptions));
// parser
// app.use(fileUpload());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// application routes
app.use('/api/v1', routes_1.default);
app.use('/images', express_1.default.static(path_1.default.join(__dirname, '../src/images')));
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('Hello World is working');
}));
app.use(globalErrorHandler_1.default);
// Not found route
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: 'Not Found',
        errorMessages: [
            {
                path: req.originalUrl,
                message: 'API not found',
            },
        ],
    });
    next();
});
exports.default = app;
