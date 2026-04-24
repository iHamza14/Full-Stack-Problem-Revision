"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Chat Routes — AI chatbot endpoint
 */
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const chat_controller_1 = require("../controllers/chat.controller");
const router = (0, express_1.Router)();
// Protected: must be logged in to use AI chat
router.post("/chat", auth_middleware_1.checkAuth, chat_controller_1.chatController);
exports.default = router;
//# sourceMappingURL=chat.route.js.map