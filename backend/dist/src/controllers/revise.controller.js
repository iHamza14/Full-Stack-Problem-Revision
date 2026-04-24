"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviseController = void 0;
const revise_service_1 = require("../services/revise.service");
const reviseController = async (req, res) => {
    try {
        const { userId, handle } = req.user;
        if (!handle) {
            return res.status(400).json({
                error: "Codeforces handle not linked"
            });
        }
        const data = await (0, revise_service_1.getRevisionSolves)(userId);
        return res.status(200).json({
            success: true,
            previousDay: data.previousDay,
            previousWeek: data.previousWeek,
            previousMonth: data.previousMonth
        });
    }
    catch (err) {
        console.error("Revise controller error:", err);
        return res.status(500).json({ error: "Failed to fetch revision data" });
    }
};
exports.reviseController = reviseController;
//# sourceMappingURL=revise.controller.js.map