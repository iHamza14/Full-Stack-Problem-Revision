"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statsSummaryController = void 0;
const studylog_service_1 = require("../services/studylog.service");
/** GET /stats/summary — total solves, today's solves, streak */
const statsSummaryController = async (req, res) => {
    try {
        const stats = await (0, studylog_service_1.getStatsSummary)(req.user.userId);
        return res.json(stats);
    }
    catch (err) {
        console.error("Stats summary error:", err);
        return res.status(500).json({ error: "Failed to fetch stats" });
    }
};
exports.statsSummaryController = statsSummaryController;
//# sourceMappingURL=studylog.controller.js.map