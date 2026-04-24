"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.histogramController = void 0;
const solveStats_service_1 = require("../services/solveStats.service");
const histogramController = async (req, res) => {
    if (!req.user || !req.user.userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const data = await (0, solveStats_service_1.getLast30DaysHistogram)(req.user.userId);
    return res.json({ data });
};
exports.histogramController = histogramController;
//# sourceMappingURL=stats.controller.js.map