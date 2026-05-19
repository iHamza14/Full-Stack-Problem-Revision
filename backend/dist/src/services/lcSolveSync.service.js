"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncLast30DaysLeetCodeSolves = syncLast30DaysLeetCodeSolves;
exports.syncLast24HoursLeetCodeSolves = syncLast24HoursLeetCodeSolves;
const prismac_1 = require("../prismac");
const leetcode_1 = require("./leetcode");
const LEETCODE_LIMIT = 100;
async function syncLast30DaysLeetCodeSolves(userId, username, platformId) {
    const cutoff = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60;
    const submissions = await (0, leetcode_1.getRecentAcceptedLeetCodeSubmissions)(username, LEETCODE_LIMIT);
    const seen = new Set();
    for (const s of submissions) {
        const solvedAtSeconds = Number(s.timestamp);
        if (!Number.isFinite(solvedAtSeconds) || solvedAtSeconds < cutoff) {
            continue;
        }
        if (seen.has(s.titleSlug))
            continue;
        seen.add(s.titleSlug);
        await upsertLeetCodeSolve(userId, platformId, {
            title: s.title,
            titleSlug: s.titleSlug,
            solvedAt: new Date(solvedAtSeconds * 1000),
        });
    }
}
async function syncLast24HoursLeetCodeSolves(userId, username, platformId) {
    const cutoff = Math.floor(Date.now() / 1000) - 24 * 60 * 60;
    const submissions = await (0, leetcode_1.getRecentAcceptedLeetCodeSubmissions)(username, 50);
    const seen = new Set();
    for (const s of submissions) {
        const solvedAtSeconds = Number(s.timestamp);
        if (!Number.isFinite(solvedAtSeconds) || solvedAtSeconds < cutoff) {
            continue;
        }
        if (seen.has(s.titleSlug))
            continue;
        seen.add(s.titleSlug);
        await upsertLeetCodeSolve(userId, platformId, {
            title: s.title,
            titleSlug: s.titleSlug,
            solvedAt: new Date(solvedAtSeconds * 1000),
        });
    }
}
async function upsertLeetCodeSolve(userId, platformId, raw) {
    const problem = await prismac_1.prisma.problem.upsert({
        where: {
            platformId_externalId: {
                platformId,
                externalId: raw.titleSlug,
            },
        },
        create: {
            platformId,
            externalId: raw.titleSlug,
            title: raw.title,
            url: `https://leetcode.com/problems/${raw.titleSlug}/`,
        },
        update: {
            title: raw.title,
            url: `https://leetcode.com/problems/${raw.titleSlug}/`,
        },
    });
    await prismac_1.prisma.solve.upsert({
        where: {
            userId_problemId: { userId, problemId: problem.id },
        },
        create: {
            userId,
            problemId: problem.id,
            solvedAt: raw.solvedAt,
        },
        update: {},
    });
}
//# sourceMappingURL=lcSolveSync.service.js.map