"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeetCodeUserInfo = getLeetCodeUserInfo;
exports.getRecentAcceptedLeetCodeSubmissions = getRecentAcceptedLeetCodeSubmissions;
exports.getLeetCodeContestRanking = getLeetCodeContestRanking;
const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";
async function leetcodeGraphQl(query, variables, operationName) {
    const res = await fetch(LEETCODE_GRAPHQL_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Referer: "https://leetcode.com",
            "User-Agent": "Mozilla/5.0",
        },
        body: JSON.stringify({ query, variables, operationName }),
    });
    if (!res.ok) {
        throw new Error("Failed to reach LeetCode API");
    }
    const body = (await res.json());
    if (body.errors?.length) {
        throw new Error(body.errors[0].message || "LeetCode API error");
    }
    if (!body.data) {
        throw new Error("Invalid LeetCode API response");
    }
    return body.data;
}
async function getLeetCodeUserInfo(username) {
    const query = `
    query userProfile($username: String!) {
      matchedUser(username: $username) {
        username
      }
    }
  `;
    const data = await leetcodeGraphQl(query, { username }, "userProfile");
    if (!data.matchedUser) {
        throw new Error("LeetCode username does not exist");
    }
    return data.matchedUser;
}
async function getRecentAcceptedLeetCodeSubmissions(username, limit = 100) {
    const query = `
    query recentAcSubmissions($username: String!, $limit: Int!) {
      recentAcSubmissionList(username: $username, limit: $limit) {
        id
        title
        titleSlug
        timestamp
      }
    }
  `;
    const data = await leetcodeGraphQl(query, { username, limit }, "recentAcSubmissions");
    return data.recentAcSubmissionList ?? [];
}
async function getLeetCodeContestRanking(username) {
    const query = `
    query userContestRankingInfo($username: String!) {
      userContestRanking(username: $username) {
        attendedContestsCount
        rating
        globalRanking
        totalParticipants
        topPercentage
      }
    }
  `;
    const data = await leetcodeGraphQl(query, { username }, "userContestRankingInfo");
    return data.userContestRanking;
}
//# sourceMappingURL=leetcode.js.map