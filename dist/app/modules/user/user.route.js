"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
// import validateRequest from '../../middlewares/validationRequest';
// import { UserValidation } from './user.validation';
// import { UserController } from './user.controller';
const router = express_1.default.Router();
// router.post(
//   '/signup',
//   validateRequest(UserValidation.createUserZodSchema),
//   UserController.createUserToDB
// );
exports.UserRoutes = router;
