"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUserHandle = void 0;
/**
 * Handle Service — links a Codeforces handle to a user
 * Updated for new schema: uses UserPlatformHandle + Platform
 */
const prismac_1 = require("../prismac");
const codeforces_1 = require("./codeforces");
const cfSolveSync_service_1 = require("./cfSolveSync.service");
// Codeforces platform ID constant (we ensure it exists)
const CF_PLATFORM_NAME = "codeforces";
const CF_PLATFORM_URL = "https://codeforces.com";
/** Ensure the Codeforces platform row exists, return its id */
async function ensureCfPlatform() {
    const platform = await prismac_1.prisma.platform.upsert({
        where: { name: CF_PLATFORM_NAME },
        create: { name: CF_PLATFORM_NAME, url: CF_PLATFORM_URL },
        update: {},
    });
    return platform.id;
}
const setUserHandle = async (userId, handle) => {
    const currentUser = await prismac_1.prisma.user.findUnique({
        where: { id: userId },
        include: { handles: { include: { platform: true } } },
    });
    if (!currentUser) {
        throw new Error("User not found");
    }
    // Check if user already has a CF handle
    const existingCf = currentUser.handles.find((h) => h.platform.name === CF_PLATFORM_NAME);
    if (existingCf) {
        throw new Error("Handle already set and cannot be changed");
    }
    // 1. Verify CF handle exists on Codeforces
    const cfUser = await (0, codeforces_1.getUserInfo)(handle);
    if (!cfUser) {
        throw new Error("Codeforces handle does not exist");
    }
    // 2. Ensure platform row exists
    const platformId = await ensureCfPlatform();
    // 3. Ensure handle not already taken by another user
    const existing = await prismac_1.prisma.userPlatformHandle.findUnique({
        where: { platformId_handle: { platformId, handle: cfUser.handle } },
    });
    if (existing) {
        throw new Error("Handle already linked to another user");
    }
    // 4. Create the platform handle link
    await prismac_1.prisma.userPlatformHandle.create({
        data: {
            userId,
            platformId,
            handle: cfUser.handle,
        },
    });
    // 5. Fire-and-forget initial sync
    (0, cfSolveSync_service_1.syncLast30DaysSolves)(userId, cfUser.handle, platformId);
    return { handle: cfUser.handle };
};
exports.setUserHandle = setUserHandle;
//# sourceMappingURL=handle.service.js.map