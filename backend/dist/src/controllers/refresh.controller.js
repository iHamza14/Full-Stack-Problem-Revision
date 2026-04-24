"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshController = void 0;
const prismac_1 = require("../prismac");
const cfSolveSync_service_1 = require("../services/cfSolveSync.service");
const refreshController = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.handle) {
            return res.status(400).json({ error: "Handle not set" });
        }
        // Fetch CF info
        const cfRes = await fetch(`https://codeforces.com/api/user.info?handles=${user.handle}`);
        const cfData = (await cfRes.json());
        if (cfData.status !== "OK") {
            return res.status(400).json({ error: "Failed to fetch CF data" });
        }
        const cfUser = cfData.result[0];
        // Find the codeforces platform ID
        const platform = await prismac_1.prisma.platform.findUnique({
            where: { name: "codeforces" },
        });
        if (platform) {
            await (0, cfSolveSync_service_1.syncLast30DaysSolves)(user.userId, user.handle, platform.id);
        }
        console.log("synced");
        return res.json({
            success: true,
            rating: cfUser.rating ?? null,
            handle: cfUser.handle,
        });
    }
    catch (err) {
        console.error("Refresh error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.refreshController = refreshController;
//# sourceMappingURL=refresh.controller.js.map