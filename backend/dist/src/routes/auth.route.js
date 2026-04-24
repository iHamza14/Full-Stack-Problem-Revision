"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Step 1: Redirect user to Google
router.get("/auth/google", (req, res) => {
    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: process.env.GOOGLE_REDIRECT_URL,
        response_type: "code",
        scope: "openid email profile"
    });
    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});
// Step 2: Google redirects back here
router.get("/auth/google/callback", auth_controller_1.googleCallbackController);
router.get("/auth/me", auth_middleware_1.checkAuth, auth_controller_1.meController);
router.get("/auth/logout", auth_controller_1.logoutController);
exports.default = router;
//# sourceMappingURL=auth.route.js.map