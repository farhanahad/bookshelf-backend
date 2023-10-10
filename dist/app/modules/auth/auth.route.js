"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validationRequest_1 = __importDefault(require("../../middlewares/validationRequest"));
const user_validation_1 = require("../user/user.validation");
const user_controller_1 = require("../user/user.controller");
const auth_validation_1 = require("./auth.validation");
const auth_controller_1 = require("./auth.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post('/signup', (0, validationRequest_1.default)(user_validation_1.UserValidation.createUserZodSchema), user_controller_1.UserController.createUserToDB);
router.post('/login', (0, validationRequest_1.default)(auth_validation_1.AuthValidation.loginZodSchema), auth_controller_1.AuthController.loginUserToDB);
router.post('/refresh-token', (0, validationRequest_1.default)(auth_validation_1.AuthValidation.refreshTokenZodSchema), auth_controller_1.AuthController.refreshTokenToDB);
router.post('/logout', (0, auth_1.default)(), auth_controller_1.AuthController.logOut);
exports.AuthRoutes = router;
