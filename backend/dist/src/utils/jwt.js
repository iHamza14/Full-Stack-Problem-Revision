"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = signToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_EXPIRES_IN = 60 * 60 * 24 * 7;
function getJwtSecret() {
    const secret = process.env.JWT_SECRET?.trim();
    if (!secret) {
        throw new Error("JWT_SECRET is not set");
    }
    return secret;
}
function signToken(payload) {
    const options = { expiresIn: JWT_EXPIRES_IN };
    return jsonwebtoken_1.default.sign(payload, getJwtSecret(), options);
}
function verifyToken(token) {
    return jsonwebtoken_1.default.verify(token, getJwtSecret());
}
//# sourceMappingURL=jwt.js.map