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
    console.log("recieved");
    console.log(req.headers["cron-secret"]);
    console.log(process.env.CRON_SECRET);
    if (req.headers["cron-secret"] !== process.env.CRON_SECRET) {
        return res.status(401).end();
    }
    console.log("verified");
    await (0, dailySync_job_1.runDailyCfSyncJob)();
    console.log("done");
    res.json({ success: true });
});
router.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
});
exports.default = router;
//# sourceMappingURL=revise.route.js.map