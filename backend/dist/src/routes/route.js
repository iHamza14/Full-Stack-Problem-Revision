"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = __importDefault(require("./auth.route"));
const revise_route_1 = __importDefault(require("./revise.route"));
const post_route_1 = __importDefault(require("./post.route"));
const chat_route_1 = __importDefault(require("./chat.route"));
const studylog_route_1 = __importDefault(require("./studylog.route"));
const router = (0, express_1.Router)();
// group routes
router.use(auth_route_1.default); // /auth/google, /auth/me, /auth/logout
router.use(revise_route_1.default); // /revise, /handle, /stats/histogram, /refresh/user
router.use(post_route_1.default); // /posts, /posts/:id, /posts/:id/like, /comments/:id/like
router.use(chat_route_1.default); // /chat
router.use(studylog_route_1.default); // /studylog, /stats/summary
exports.default = router;
//# sourceMappingURL=route.js.map