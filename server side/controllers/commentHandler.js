const User = require("../models/userModel");
const Post = require("../models/postsModel");
const Comment = require("../models/comments");
const asyncHandler = require("../utils/asyncHandler");
const mongoose = require("mongoose");
const { likeFunction } = require("../utils/likeUnlike");

exports.getAllComments = asyncHandler(async (req, res, next) => {
  const limit = 10;
  const page = parseInt(req.query.page) || 1;

  const allComments = await Comment.find()
    .sort({ createdAt: -1 })
    .populate([
      { path: "user", select: "_id name email profilePhoto" },
      { path: "post", select: "_id title" },
    ]);

  const commentsCount = await Comment.countDocuments({});
  const paginationInfo = {
    currentPage: page,
    pagesNumber: commentsCount / limit,
  };

  if (!allComments) return res.status(200).json({ state: "no comments" });
  return res.status(200).json({ state: "success", data: allComments });
});

exports.getCommentsForSpecificPost = asyncHandler(async (req, res, next) => {
  const { id: postId } = req.params;

  if (!mongoose.isValidObjectId(postId))
    return res.status(400).json({ state: "invalid post id" });

  const comments = await Comment.find({ post: postId }).populate(
    "user",
    "_id name profilePhoto"
  );
  if (!comments.length) return res.status(404).json({ state: "no comments" });

  return res.status(200).json({ state: "success", data: comments });
});

exports.makeComment = asyncHandler(async (req, res, next) => {
  const { id: postId } = req.params;
  const userId = req.userId;

  if (!mongoose.isValidObjectId(postId))
    return res.status(400).json({ state: "invalid post id" });

  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ state: "post not found" });

  let comment = await Comment.create({
    user: userId,
    post: postId,
    comment: req.body.message,
  });
  if (comment) {
    comment = await comment.populate("user", "_id name profilePhoto");
    return res.status(200).json({
      state: "success",
      data: comment,
    });
  }
});

exports.modifyComment = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;
  const userId = req.userId;

  if (!mongoose.isValidObjectId(postId))
    return res.status(400).json({ state: "invalid post id" });

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    { comment: req.body.message },
    { new: true }
  ).populate("user", "_id name profilePhoto");

  if (!comment) return res.status(404).json({ state: "comment not found" });

  return res.status(200).json({
    state: "success",
    data: comment,
  });

});

exports.toggleLikeUnlikeComment = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;
  await likeFunction(req, res, commentId, Comment);
});

exports.getCommentsForSpecificUser = asyncHandler(async (req, res, next) => {
  const userId = req.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const allComments = await Comment.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("post", "_id title");

  if (!allComments.length) return res.status(200).json({ state: "no comments" });

  return res.status(200).json({
    state: "success",
    data: allComments,
  });

});

exports.deleteComment = asyncHandler(async (req, res, next) => {
  // admin only can delete list of comments
  const listOfDeletedIds = req.body;
  if (listOfDeletedIds && Array.isArray(listOfDeletedIds)) {
    const result = await Comment.deleteMany({ _id: { $in: listOfDeletedIds } });
    return res.status(200).json({
      state: `deleted comments : ${result.deletedCount}`,
    });
  }

  const { commentId } = req.params;
  if (!mongoose.isValidObjectId(commentId)) return res.status(400).json({ state: "invalid comment id" });
  await Comment.deleteMany({ $or: [{ _id: commentId }, { parentComment: commentId }] });
  return res.status(200).json({
    state: "success",
  });
}
);
