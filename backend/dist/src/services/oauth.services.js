"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleOAuthLogin = void 0;
/**
 * OAuth Service — Google OAuth login flow
 * Updated: no longer references handle/rating on User model
 */
const prismac_1 = require("../prismac");
const crypto_1 = require("crypto");
const jwt_1 = require("../utils/jwt");
const googleOAuthLogin = async (code) => {
    // 1. Exchange code → tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            code,
            grant_type: "authorization_code",
            redirect_uri: process.env.GOOGLE_REDIRECT_URL,
        }),
    });
    const tokenData = (await tokenRes.json());
    if (!tokenData.access_token) {
        throw new Error("Google OAuth token exchange failed");
    }
    // 2. Fetch user profile
    const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const googleUser = (await userRes.json());
    if (!googleUser.sub || !googleUser.email) {
        throw new Error("Invalid Google user data");
    }
    // 3. Find or create user in DB
    let user = await prismac_1.prisma.user.findUnique({
        where: { oauthId: googleUser.sub },
    });
    if (!user) {
        user = await prismac_1.prisma.user.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
                email: googleUser.email,
                oauthProvider: "google",
                oauthId: googleUser.sub,
            },
        });
    }
    // 4. Issue your JWT
    const token = (0, jwt_1.signToken)({ userId: user.id, email: user.email });
    return { user, token };
};
exports.googleOAuthLogin = googleOAuthLogin;
//# sourceMappingURL=oauth.services.js.map