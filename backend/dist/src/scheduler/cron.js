"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const dailySync_job_1 = require("../jobs/dailySync.job");
// Runs every day at 12:00 AM server time
node_cron_1.default.schedule("0 0 * * *", async () => {
    try {
        await (0, dailySync_job_1.runDailyCfSyncJob)();
    }
    catch (err) {
        console.error("Daily CF sync job crashed", err);
    }
});
//# sourceMappingURL=cron.js.map