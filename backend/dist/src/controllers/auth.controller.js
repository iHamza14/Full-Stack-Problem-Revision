"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutController = exports.meController = exports.googleCallbackController = void 0;
const oauth_services_1 = require("../services/oauth.services");
const leetcode_1 = require("../services/leetcode");
const googleCallbackController = async (req, res) => {
    try {
        const { code } = req.query;
        if (!code || typeof code !== "string") {
            return res.status(400).send("Missing OAuth code");
        }
        const { user, token } = await (0, oauth_services_1.googleOAuthLogin)(code);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        return res.redirect(new URL("/auth/finish", process.env.FRONTEND_URL).toString());
    }
    catch (err) {
        console.error("Google OAuth error:", err);
        return res.status(401).send("Google OAuth failed");
    }
};
exports.googleCallbackController = googleCallbackController;
/** GET /auth/me — returns user info with handle and live CF rating */
const meController = async (req, res) => {
    const { userId, email, handle, leetCodeHandle, handles } = req.user;
    // If user has a CF handle, fetch live rating from CF API
    let rating = null;
    let leetCodeRating = null;
    if (handle) {
        try {
            const cfRes = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
            const cfData = (await cfRes.json());
            if (cfData.status === "OK" && cfData.result.length > 0) {
                rating = cfData.result[0].rating ?? null;
            }
        }
        catch {
            // CF API might be down, return null rating
        }
    }
    if (leetCodeHandle) {
        try {
            const ranking = await (0, leetcode_1.getLeetCodeContestRanking)(leetCodeHandle);
            leetCodeRating =
                ranking && ranking.attendedContestsCount > 0
                    ? Math.round(ranking.rating)
                    : null;
        }
        catch {
            // LeetCode API might be down, return null rating
        }
    }
    return res.json({
        userId,
        email,
        handle,
        leetCodeHandle,
        handles,
        rating,
        leetCodeRating,
    });
};
exports.meController = meController;
const logoutController = (_req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
    });
    return res.sendStatus(200);
};
exports.logoutController = logoutController;
//# sourceMappingURL=auth.controller.js.map