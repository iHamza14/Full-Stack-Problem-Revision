"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * StudyLog Routes — stats endpoint
 * Simplified: no study hours logging since StudyLog model was removed
 */
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const studylog_controller_1 = require("../controllers/studylog.controller");
const router = (0, express_1.Router)();
// Stats summary requires authentication
router.get("/stats/summary", auth_middleware_1.checkAuth, studylog_controller_1.statsSummaryController);
exports.default = router;
//# sourceMappingURL=studylog.route.js.map