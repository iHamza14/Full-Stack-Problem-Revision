"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatController = void 0;
const chat_service_1 = require("../services/chat.service");
/** POST /chat — send a message to the AI tutor */
const chatController = async (req, res) => {
    try {
        const { message, history } = req.body;
        if (!message || typeof message !== "string") {
            return res.status(400).json({ error: "Message is required" });
        }
        const reply = await (0, chat_service_1.getChatResponse)(message, history || []);
        return res.json({ reply });
    }
    catch (err) {
        console.error("Chat controller error:", err);
        return res.status(500).json({ error: "Chat service unavailable" });
    }
};
exports.chatController = chatController;
//# sourceMappingURL=chat.controller.js.map