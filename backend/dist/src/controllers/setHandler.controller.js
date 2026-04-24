"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setHandleController = void 0;
const handle_service_1 = require("../services/handle.service");
const setHandleController = async (req, res) => {
    try {
        const { handle } = req.body;
        const { userId } = req.user;
        if (!handle) {
            return res.status(400).json({ error: "Handle is required" });
        }
        const result = await (0, handle_service_1.setUserHandle)(userId, handle);
        return res.status(200).json({
            success: true,
            handle: result.handle,
        });
    }
    catch (err) {
        return res.status(400).json({
            error: err.message || "Failed to set handle",
        });
    }
};
exports.setHandleController = setHandleController;
//# sourceMappingURL=setHandler.controller.js.map