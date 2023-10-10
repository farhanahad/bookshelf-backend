"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHelpers = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = (payload, secret, expirationTime) => {
    return jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn: expirationTime,
    });
};
// export const createToken = (
//   payload: { phoneNumber: string; role: string; _id: string },
//   secret: Secret,
//   expirationTime: string
// ): string => {
//   return jwt.sign(payload, secret, {
//     expiresIn: expirationTime,
//   });
// };
const verifyToken = (token, secret) => {
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.jwtHelpers = { createToken, verifyToken };
