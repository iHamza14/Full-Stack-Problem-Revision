"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPosts = listPosts;
exports.getPostById = getPostById;
exports.createPost = createPost;
exports.togglePostLike = togglePostLike;
exports.toggleCommentLike = toggleCommentLike;
exports.addComment = addComment;
/**
 * Post Service — Prisma queries for blog/discussion CRUD
 * Updated for new schema: User doesn't have handle directly, uses UserPlatformHandle
 */
const prismac_1 = require("../prismac");
// Consistent author select shape (includes CF handles)
const authorSelect = {
    id: true,
    email: true,
    handles: {
        include: { platform: true },
    },
};
/* ───────── POST QUERIES ───────── */
/** Fetch paginated posts with author, like count, comment count, and tags */
async function listPosts(page = 1, limit = 10, search) {
    const skip = (page - 1) * limit;
    const where = search
        ? {
            OR: [
                { title: { contains: search, mode: "insensitive" } },
                { content: { contains: search, mode: "insensitive" } },
            ],
        }
        : {};
    const [posts, total] = await Promise.all([
        prismac_1.prisma.post.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                author: { select: authorSelect },
                tags: { include: { tag: true } },
                _count: { select: { likes: true, comments: true } },
            },
        }),
        prismac_1.prisma.post.count({ where }),
    ]);
    return { posts, total, page, totalPages: Math.ceil(total / limit) };
}
/** Fetch single post with full comments tree and like info */
async function getPostById(postId, userId) {
    const post = await prismac_1.prisma.post.findUnique({
        where: { id: postId },
        include: {
            author: { select: authorSelect },
            tags: { include: { tag: true } },
            comments: {
                orderBy: { createdAt: "asc" },
                include: {
                    user: { select: authorSelect },
                    _count: { select: { likes: true } },
                },
            },
            _count: { select: { likes: true, comments: true } },
        },
    });
    if (!post)
        return null;
    // Check if current user has liked this post
    let userLiked = false;
    if (userId) {
        const like = await prismac_1.prisma.postLike.findUnique({
            where: { userId_postId: { userId, postId } },
        });
        userLiked = !!like;
    }
    return { ...post, userLiked };
}
/** Create a new post */
async function createPost(authorId, title, content, tagNames = []) {
    // Upsert tags first
    const tagRecords = await Promise.all(tagNames.map((name) => prismac_1.prisma.tag.upsert({
        where: { name: name.toLowerCase().trim() },
        create: { name: name.toLowerCase().trim() },
        update: {},
    })));
    const post = await prismac_1.prisma.post.create({
        data: {
            authorId,
            title,
            content,
            tags: {
                create: tagRecords.map((t) => ({ tagId: t.id })),
            },
        },
        include: {
            author: { select: authorSelect },
            tags: { include: { tag: true } },
            _count: { select: { likes: true, comments: true } },
        },
    });
    return post;
}
/* ───────── LIKE QUERIES ───────── */
/** Toggle like on a post — returns new like status */
async function togglePostLike(userId, postId) {
    const existing = await prismac_1.prisma.postLike.findUnique({
        where: { userId_postId: { userId, postId } },
    });
    if (existing) {
        await prismac_1.prisma.postLike.delete({
            where: { userId_postId: { userId, postId } },
        });
        return { liked: false };
    }
    else {
        await prismac_1.prisma.postLike.create({ data: { userId, postId } });
        return { liked: true };
    }
}
/** Toggle like on a comment */
async function toggleCommentLike(userId, commentId) {
    const existing = await prismac_1.prisma.commentLike.findUnique({
        where: { userId_commentId: { userId, commentId } },
    });
    if (existing) {
        await prismac_1.prisma.commentLike.delete({
            where: { userId_commentId: { userId, commentId } },
        });
        return { liked: false };
    }
    else {
        await prismac_1.prisma.commentLike.create({ data: { userId, commentId } });
        return { liked: true };
    }
}
/* ───────── COMMENT QUERIES ───────── */
/** Add a comment to a post (optionally as a reply) */
async function addComment(postId, userId, content, parentId) {
    return prismac_1.prisma.comment.create({
        data: { postId, userId, content, parentId },
        include: {
            user: { select: authorSelect },
            _count: { select: { likes: true } },
        },
    });
}
//# sourceMappingURL=post.service.js.map