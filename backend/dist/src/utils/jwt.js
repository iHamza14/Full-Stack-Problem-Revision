"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = signToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";
const JWT_EXPIRES_IN = 60 * 60 * 24 * 7;
;
function signToken(payload) {
    const options = { expiresIn: JWT_EXPIRES_IN };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
}
function verifyToken(token) {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
}
//# sourceMappingURL=jwt.js.map