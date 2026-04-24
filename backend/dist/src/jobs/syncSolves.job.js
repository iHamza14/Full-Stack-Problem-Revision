"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncUserSolves = syncUserSolves;
/**
 * Sync Solves Job — wrapper to fire-and-forget CF solve sync
 * Updated: now passes platformId as required by the new schema
 */
const prismac_1 = require("../prismac");
const cfSolveSync_service_1 = require("../services/cfSolveSync.service");
async function syncUserSolves(userId, handle) {
    try {
        // Find/create the codeforces platform
        const platform = await prismac_1.prisma.platform.upsert({
            where: { name: "codeforces" },
            create: { name: "codeforces", url: "https://codeforces.com" },
            update: {},
        });
        await (0, cfSolveSync_service_1.syncLast30DaysSolves)(userId, handle, platform.id);
    }
    catch (err) {
        console.error(`CF solve sync failed for user ${handle}:`, err);
    }
}
//# sourceMappingURL=syncSolves.job.js.map