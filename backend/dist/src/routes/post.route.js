"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Post Routes — blog/discussion API endpoints
 */
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const post_controller_1 = require("../controllers/post.controller");
const router = (0, express_1.Router)();
// Public: anyone can read posts
router.get("/posts", post_controller_1.listPostsController);
router.get("/posts/:id", post_controller_1.getPostController);
// Protected: must be logged in to create/like/comment
router.post("/posts", auth_middleware_1.checkAuth, post_controller_1.createPostController);
router.post("/posts/:id/like", auth_middleware_1.checkAuth, post_controller_1.likePostController);
router.post("/posts/:id/comments", auth_middleware_1.checkAuth, post_controller_1.addCommentController);
router.post("/comments/:id/like", auth_middleware_1.checkAuth, post_controller_1.likeCommentController);
exports.default = router;
//# sourceMappingURL=post.route.js.map