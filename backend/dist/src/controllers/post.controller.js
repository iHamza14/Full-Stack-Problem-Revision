"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeCommentController = exports.addCommentController = exports.likePostController = exports.createPostController = exports.getPostController = exports.listPostsController = void 0;
const post_service_1 = require("../services/post.service");
/** GET /posts — paginated list of posts */
const listPostsController = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search;
        const data = await (0, post_service_1.listPosts)(page, limit, search);
        return res.json(data);
    }
    catch (err) {
        console.error("List posts error:", err);
        return res.status(500).json({ error: "Failed to fetch posts" });
    }
};
exports.listPostsController = listPostsController;
/** GET /posts/:id — single post with comments */
const getPostController = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const postId = req.params.id;
        const post = await (0, post_service_1.getPostById)(postId, userId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        return res.json(post);
    }
    catch (err) {
        console.error("Get post error:", err);
        return res.status(500).json({ error: "Failed to fetch post" });
    }
};
exports.getPostController = getPostController;
/** POST /posts — create a new post */
const createPostController = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const authorId = req.user.userId;
        if (!title || !content) {
            return res.status(400).json({ error: "Title and content are required" });
        }
        const post = await (0, post_service_1.createPost)(authorId, title, content, tags || []);
        return res.status(201).json(post);
    }
    catch (err) {
        console.error("Create post error:", err);
        return res.status(500).json({ error: "Failed to create post" });
    }
};
exports.createPostController = createPostController;
/** POST /posts/:id/like — toggle like on a post */
const likePostController = async (req, res) => {
    try {
        const postId = req.params.id;
        const result = await (0, post_service_1.togglePostLike)(req.user.userId, postId);
        return res.json(result);
    }
    catch (err) {
        console.error("Like post error:", err);
        return res.status(500).json({ error: "Failed to toggle like" });
    }
};
exports.likePostController = likePostController;
/** POST /posts/:id/comments — add a comment */
const addCommentController = async (req, res) => {
    try {
        const { content, parentId } = req.body;
        const postId = req.params.id;
        if (!content) {
            return res.status(400).json({ error: "Comment content is required" });
        }
        const comment = await (0, post_service_1.addComment)(postId, req.user.userId, content, parentId);
        return res.status(201).json(comment);
    }
    catch (err) {
        console.error("Add comment error:", err);
        return res.status(500).json({ error: "Failed to add comment" });
    }
};
exports.addCommentController = addCommentController;
/** POST /comments/:id/like — toggle like on a comment */
const likeCommentController = async (req, res) => {
    try {
        const commentId = req.params.id;
        const result = await (0, post_service_1.toggleCommentLike)(req.user.userId, commentId);
        return res.json(result);
    }
    catch (err) {
        console.error("Like comment error:", err);
        return res.status(500).json({ error: "Failed to toggle comment like" });
    }
};
exports.likeCommentController = likeCommentController;
//# sourceMappingURL=post.controller.js.map