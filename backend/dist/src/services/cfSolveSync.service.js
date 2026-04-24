"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncLast30DaysSolves = syncLast30DaysSolves;
exports.syncLast24HoursSolves = syncLast24HoursSolves;
/**
 * Codeforces Solve Sync Service
 * Updated for new schema: creates Problem records, then links Solve via problemId
 */
const prismac_1 = require("../prismac");
const PAGE_SIZE = 100;
const MAX_PAGES = 10; // hard safety cap
const DELAY_MS = 300; // prevent CF rate-limit
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
async function syncLast30DaysSolves(userId, handle, platformId) {
    const cutoff = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60;
    let from = 1;
    let pagesFetched = 0;
    const seen = new Set();
    const rawSolves = [];
    while (pagesFetched < MAX_PAGES) {
        pagesFetched++;
        const res = await fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=${from}&count=${PAGE_SIZE}`);
        if (!res.ok)
            break;
        const data = (await res.json());
        if (data.status !== "OK")
            break;
        if (data.result.length === 0)
            break;
        for (const s of data.result) {
            // submissions are sorted newest → oldest
            if (s.creationTimeSeconds < cutoff) {
                pagesFetched = MAX_PAGES;
                break;
            }
            if (s.verdict !== "OK")
                continue;
            const key = `${s.problem.contestId}-${s.problem.index}`;
            if (seen.has(key))
                continue;
            seen.add(key);
            rawSolves.push({
                contestId: s.problem.contestId,
                index: s.problem.index,
                problemName: s.problem.name ?? null,
                solvedAt: new Date(s.creationTimeSeconds * 1000),
            });
        }
        from += PAGE_SIZE;
        console.log("working");
        await sleep(DELAY_MS);
    }
    if (rawSolves.length === 0)
        return;
    // Upsert Problem records and create Solve entries
    for (const raw of rawSolves) {
        const externalId = `${raw.contestId}/${raw.index}`;
        const url = `https://codeforces.com/problemset/problem/${raw.contestId}/${raw.index}`;
        try {
            // Upsert the problem
            const problem = await prismac_1.prisma.problem.upsert({
                where: {
                    platformId_externalId: { platformId, externalId },
                },
                create: {
                    platformId,
                    externalId,
                    title: raw.problemName || `${raw.contestId}${raw.index}`,
                    url,
                },
                update: {
                    title: raw.problemName || undefined,
                },
            });
            // Create the solve (skip if already exists)
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
        catch (err) {
            // Skip duplicates or constraint errors
            console.error(`Failed to sync ${externalId}:`, err);
        }
    }
}
async function syncLast24HoursSolves(userId, handle, platformId) {
    const cutoff = Math.floor(Date.now() / 1000) - 24 * 60 * 60;
    let from = 1;
    let pagesFetched = 0;
    const seen = new Set();
    const rawSolves = [];
    while (pagesFetched < 3) {
        pagesFetched++;
        const res = await fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=${from}&count=${PAGE_SIZE}`);
        if (!res.ok)
            break;
        const data = (await res.json());
        if (data.status !== "OK")
            break;
        if (data.result.length === 0)
            break;
        for (const s of data.result) {
            if (s.creationTimeSeconds < cutoff) {
                pagesFetched = 3;
                break;
            }
            if (s.verdict !== "OK")
                continue;
            const key = `${s.problem.contestId}-${s.problem.index}`;
            if (seen.has(key))
                continue;
            seen.add(key);
            rawSolves.push({
                contestId: s.problem.contestId,
                index: s.problem.index,
                problemName: s.problem.name ?? null,
                solvedAt: new Date(s.creationTimeSeconds * 1000),
            });
        }
        from += PAGE_SIZE;
        await sleep(DELAY_MS);
    }
    if (rawSolves.length === 0)
        return;
    // Same upsert logic as 30-day sync
    for (const raw of rawSolves) {
        const externalId = `${raw.contestId}/${raw.index}`;
        const url = `https://codeforces.com/problemset/problem/${raw.contestId}/${raw.index}`;
        try {
            const problem = await prismac_1.prisma.problem.upsert({
                where: {
                    platformId_externalId: { platformId, externalId },
                },
                create: {
                    platformId,
                    externalId,
                    title: raw.problemName || `${raw.contestId}${raw.index}`,
                    url,
                },
                update: {},
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
        catch (err) {
            console.error(`Failed to sync ${externalId}:`, err);
        }
    }
}
//# sourceMappingURL=cfSolveSync.service.js.map