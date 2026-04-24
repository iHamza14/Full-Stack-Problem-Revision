"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDailyCfSyncJob = runDailyCfSyncJob;
/**
 * Daily Sync Job — syncs last 24h of CF solves for all users
 * Updated for new schema: reads handle from UserPlatformHandle
 */
const prismac_1 = require("../prismac");
const cfSolveSync_service_1 = require("../services/cfSolveSync.service");
const CONCURRENCY = 5;
async function runDailyCfSyncJob() {
    console.log("Starting daily Codeforces sync...");
    // Find the codeforces platform
    const cfPlatform = await prismac_1.prisma.platform.findUnique({
        where: { name: "codeforces" },
    });
    if (!cfPlatform) {
        console.log("No codeforces platform found, skipping sync.");
        return;
    }
    // Get all users who have a CF handle linked
    const handles = await prismac_1.prisma.userPlatformHandle.findMany({
        where: { platformId: cfPlatform.id },
        select: { userId: true, handle: true },
    });
    let index = 0;
    async function worker() {
        while (index < handles.length) {
            const current = handles[index++];
            try {
                await (0, cfSolveSync_service_1.syncLast24HoursSolves)(current.userId, current.handle, cfPlatform.id);
                console.log(`Synced ${current.handle}`);
            }
            catch (err) {
                console.error(`Failed for ${current.handle}`, err);
            }
        }
    }
    const workers = [];
    for (let i = 0; i < CONCURRENCY; i++) {
        workers.push(worker());
    }
    await Promise.all(workers);
    console.log("Daily Codeforces sync complete.");
}
//# sourceMappingURL=dailySync.job.js.map