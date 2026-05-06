"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const revise_controller_1 = require("../controllers/revise.controller");
const setHandler_controller_1 = require("../controllers/setHandler.controller");
const stats_controller_1 = require("../controllers/stats.controller");
const refresh_controller_1 = require("../controllers/refresh.controller");
const dailySync_job_1 = require("../jobs/dailySync.job");
const router = (0, express_1.Router)();
router.post("/handle", auth_middleware_1.checkAuth, setHandler_controller_1.setHandleController);
router.get("/revise", auth_middleware_1.checkAuth, revise_controller_1.reviseController);
router.get("/stats/histogram", auth_middleware_1.checkAuth, stats_controller_1.histogramController);
router.get("/refresh/user", auth_middleware_1.checkAuth, refresh_controller_1.refreshController);
router.post("/sync", async (req, res) => {
    const cronSecret = process.env.CRON_SECRET;
    const incomingSecret = req.headers["cron-secret"];
    if (!cronSecret) {
        return res.status(500).json({ error: "CRON_SECRET is not configured" });
    }
    if (typeof incomingSecret !== "string" || incomingSecret !== cronSecret) {
        return res.status(401).end();
    }
    try {
        await (0, dailySync_job_1.runDailyCfSyncJob)();
        res.json({ success: true });
    }
    catch (err) {
        console.error("Manual sync failed", err);
        res.status(500).json({ error: "Sync failed" });
    }
});
router.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
});
exports.default = router;
//# sourceMappingURL=revise.route.js.map