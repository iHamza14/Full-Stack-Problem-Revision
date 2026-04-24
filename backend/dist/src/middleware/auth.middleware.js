"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const jwt_1 = require("../utils/jwt");
const prismac_1 = require("../prismac");
const checkAuth = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const payload = (0, jwt_1.verifyToken)(token); // { userId: string }
        // Load user from DB with platform handles
        const dbUser = await prismac_1.prisma.user.findUnique({
            where: { id: payload.userId },
            include: {
                handles: {
                    include: { platform: true },
                },
            },
        });
        if (!dbUser) {
            return res.status(401).json({ error: "User not found" });
        }
        // Find the Codeforces handle if linked
        const cfHandle = dbUser.handles.find((h) => h.platform.name.toLowerCase() === "codeforces");
        req.user = {
            userId: dbUser.id,
            email: dbUser.email,
            handle: cfHandle?.handle ?? null,
        };
        next();
    }
    catch {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};
exports.checkAuth = checkAuth;
//# sourceMappingURL=auth.middleware.js.map