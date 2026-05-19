"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDailyCfSyncJob = runDailyCfSyncJob;
/**
 * Daily Sync Job — syncs last 24h of CF solves for all users
 * Updated for new schema: reads handle from UserPlatformHandle
 */
const prismac_1 = require("../prismac");
const cfSolveSync_service_1 = require("../services/cfSolveSync.service");
const lcSolveSync_service_1 = require("../services/lcSolveSync.service");
const CONCURRENCY = 5;
async function runDailyCfSyncJob() {
    console.log("Starting daily platform sync...");
    // Find the codeforces platform
    const cfPlatform = await prismac_1.prisma.platform.findUnique({
        where: { name: "codeforces" },
    });
    if (!cfPlatform) {
        console.log("No codeforces platform found, skipping sync.");
    }
    else {
        await syncPlatformHandles(cfPlatform.id, "Codeforces", (userId, handle) => (0, cfSolveSync_service_1.syncLast24HoursSolves)(userId, handle, cfPlatform.id));
    }
    const lcPlatform = await prismac_1.prisma.platform.findUnique({
        where: { name: "leetcode" },
    });
    if (!lcPlatform) {
        console.log("No leetcode platform found, skipping sync.");
    }
    else {
        await syncPlatformHandles(lcPlatform.id, "LeetCode", (userId, handle) => (0, lcSolveSync_service_1.syncLast24HoursLeetCodeSolves)(userId, handle, lcPlatform.id));
    }
    console.log("Daily platform sync complete.");
}
async function syncPlatformHandles(platformId, label, syncFn) {
    const handles = await prismac_1.prisma.userPlatformHandle.findMany({
        where: { platformId },
        select: { userId: true, handle: true },
    });
    let index = 0;
    async function worker() {
        while (index < handles.length) {
            const current = handles[index++];
            try {
                await syncFn(current.userId, current.handle);
                console.log(`Synced ${label} ${current.handle}`);
            }
            catch (err) {
                console.error(`Failed for ${label} ${current.handle}`, err);
            }
        }
    }
    const workers = [];
    for (let i = 0; i < CONCURRENCY; i++) {
        workers.push(worker());
    }
    await Promise.all(workers);
}
//# sourceMappingURL=dailySync.job.js.map