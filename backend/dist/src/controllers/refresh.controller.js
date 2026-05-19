"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshController = void 0;
const prismac_1 = require("../prismac");
const cfSolveSync_service_1 = require("../services/cfSolveSync.service");
const lcSolveSync_service_1 = require("../services/lcSolveSync.service");
const leetcode_1 = require("../services/leetcode");
const refreshController = async (req, res) => {
    try {
        const user = req.user;
        if (!user || (!user.handle && !user.leetCodeHandle)) {
            return res.status(400).json({ error: "Handle not set" });
        }
        let rating = null;
        let leetCodeRating = null;
        let cfHandle = user.handle ?? null;
        // Find the codeforces platform ID
        const cfPlatform = await prismac_1.prisma.platform.findUnique({
            where: { name: "codeforces" },
        });
        if (user.handle && cfPlatform) {
            const cfRes = await fetch(`https://codeforces.com/api/user.info?handles=${user.handle}`);
            const cfData = (await cfRes.json());
            if (cfData.status !== "OK") {
                return res.status(400).json({ error: "Failed to fetch CF data" });
            }
            const cfUser = cfData.result[0];
            rating = cfUser.rating ?? null;
            cfHandle = cfUser.handle ?? user.handle;
            await (0, cfSolveSync_service_1.syncLast30DaysSolves)(user.userId, user.handle, cfPlatform.id);
        }
        const lcPlatform = await prismac_1.prisma.platform.findUnique({
            where: { name: "leetcode" },
        });
        if (user.leetCodeHandle && lcPlatform) {
            const ranking = await (0, leetcode_1.getLeetCodeContestRanking)(user.leetCodeHandle);
            leetCodeRating =
                ranking && ranking.attendedContestsCount > 0
                    ? Math.round(ranking.rating)
                    : null;
            await (0, lcSolveSync_service_1.syncLast30DaysLeetCodeSolves)(user.userId, user.leetCodeHandle, lcPlatform.id);
        }
        console.log("synced");
        return res.json({
            success: true,
            rating,
            leetCodeRating,
            handle: cfHandle,
            leetCodeHandle: user.leetCodeHandle ?? null,
        });
    }
    catch (err) {
        console.error("Refresh error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.refreshController = refreshController;
//# sourceMappingURL=refresh.controller.js.map