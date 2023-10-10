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
exports.AuthController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const auth_service_1 = require("./auth.service");
const config_1 = __importDefault(require("../../../config"));
const responseData_1 = __importDefault(require("../../../shared/responseData"));
const http_status_1 = __importDefault(require("http-status"));
const loginUserToDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginData = __rest(req.body, []);
    const result = yield auth_service_1.AuthService.loginUser(loginData);
    const { refreshToken } = result, others = __rest(result, ["refreshToken"]);
    // set refresh cookies
    const cookieOptions = {
        secure: config_1.default.env === 'production',
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    (0, responseData_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User successfully logged in!',
        data: others,
    });
}));
const refreshTokenToDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = yield req.cookies.refreshToken;
    const result = yield auth_service_1.AuthService.refreshToken(refreshToken);
    // set refresh token into cookie
    const cookieOptions = {
        secure: config_1.default.env === 'production',
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    (0, responseData_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'New access token generated successfully !',
        data: result,
    });
}));
const logOut = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const refreshToken = req?.headers?.authorization ?? '';
    const refreshToken = yield req.cookies.refreshToken;
    const result = yield auth_service_1.AuthService.logOut(refreshToken);
    // set refresh cookies
    const cookieOptions = {
        secure: config_1.default.env === 'production',
        httpOnly: true,
        expires: new Date(0),
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    (0, responseData_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User logOut successfully!',
        data: result,
    });
}));
exports.AuthController = {
    loginUserToDB,
    refreshTokenToDB,
    logOut,
};
