"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSolves = getSolves;
const prismac_1 = require("../prismac");
async function getSolves(req, res) {
    const { userId, filter } = req.query;
    if (!userId || !filter) {
        return res.status(400).json({ error: "Missing params" });
    }
    const now = new Date();
    let fromDate;
    if (filter === "yesterday") {
        fromDate = new Date(now);
        fromDate.setDate(fromDate.getDate() - 1);
        fromDate.setHours(0, 0, 0, 0);
    }
    else if (filter === "lastWeek") {
        fromDate = new Date(now);
        fromDate.setDate(fromDate.getDate() - 7);
        fromDate.setHours(0, 0, 0, 0);
    }
    else {
        fromDate = new Date(now);
        fromDate.setDate(fromDate.getDate() - 30);
        fromDate.setHours(0, 0, 0, 0);
    }
    const solves = await prismac_1.prisma.solve.findMany({
        where: {
            userId,
            solvedAt: {
                gte: fromDate
            }
        },
        orderBy: {
            solvedAt: "desc"
        }
    });
    res.json({ solves });
}
//# sourceMappingURL=solve.controller.js.map