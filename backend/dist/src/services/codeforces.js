"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = getUserInfo;
async function getUserInfo(handle) {
    const res = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
    if (!res.ok) {
        throw new Error("Failed to reach Codeforces API");
    }
    const data = (await res.json());
    if (data.status !== "OK") {
        throw new Error(data.comment || "Invalid Codeforces handle");
    }
    return data.result[0];
}
//# sourceMappingURL=codeforces.js.map