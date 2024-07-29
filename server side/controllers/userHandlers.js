const User = require("../models/userModel");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const joi = require("joi");
const userValidation = require("../validation/userValidation");
const path = require("path");
const Comment = require("../models/comments");
const Post = require("../models/postsModel");

function createTokenAndCookie(id, res) {
  const token = jwt.sign({ userId: id }, `${process.env.JWT_SECRET}`, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });

  res.cookie("jwt", token, {
    maxAge: 1000 * 60 * 60 * 24 * 20,
    httpOnly: true,
  });
}

exports.signUp = asyncHandler(async (req, res, next) => {
  const { name, password, repeatPassword, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 11);
  const user = await User.create({
    name: name,
    password: hashedPassword,
    email: email,
  });
  createTokenAndCookie(user._id, res);

  res.status(200).json({
    state: "success",
    data: user,
  });
});

exports.signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    createTokenAndCookie(user._id, res);
    res.status(200).json({
      state: "success",
      message: "you are logged in",
      data: user,
    });
  } else {
    res.status(400).json({
      state: "failed",
      message: "incorrect email or password",
    });
  }
});

exports.signOut = asyncHandler(async (req, res, next) => {
  res.cookie("jwt", "", { httpOnly: true, maxAge: 1 });
  res.status(200).json({
    state: "success",
  });
});

/**
 * @access only admin
 */
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({});
  if (!users) return res.status(200).json({ state: "no users" });
  return res.status(200).json({ state: "success", data: users });
});

exports.updateProfile = asyncHandler(async (req, res, next) => {
  const { name, bio } = req.body;
  const image = req.file || req.body?.image;
  const userId = req.userId;
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        name,
        bio,
        profilePhoto: image?.filename
          ? `http://localhost:5000/${image.filename}`
          : `http://localhost:5000/${image}`,
      },
    },
    { new: true }
  ).select("-password");

  if (!user) return res.status(404).json({ state: "user not found" });

  return res.json({
    status: "success",
    data: user,
  });
});

exports.changePassword = asyncHandler(async (req, res, next) => {
  const userId = req.userId;
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(userId);
  if (!(user && (await bcrypt.compare(password, user.password))))
    return res.status(400).json({
      state: "invalid credentials",
    });

  user.password = newPassword;
  await user.save();
  res.cookie("jwt", "", { httpOnly: true, maxAge: 1 });
  return res.status(200).json({
    state: "success",
    message: "password changed successfully , please login again",
  });
});

exports.getLikesForUser = asyncHandler(async (req, res, next) => {
  const userId = req.userId;
  const postsLikes = await Post.find({ likes: userId });
  const commentsLikes = await Comment.find({ likes: userId });

  if (postsLikes || commentsLikes)
    return res.status(200).json({
      state: "success",
      postsLikes,
      commentsLikes,
    });

  return res.status(200).json({
    state: "no likes",
  });
});

exports.deleteUserAccount = asyncHandler(async (req, res, next) => {
  const listOfDeletedIds = req.body;
  if (listOfDeletedIds && Array.isArray(listOfDeletedIds)) {
    const usersResult = await User.deleteMany({ _id: { $in: listOfDeletedIds } });
    const commentsResult = await Comment.deleteMany({ user: { $in: listOfDeletedIds } });
    const postsResult = await Post.deleteMany({ author: { $in: listOfDeletedIds } });

    return res.status(200).json({
      state: `deleted states : ${
        (usersResult.deletedCount, commentsResult.deletedCount, postsResult.deletedCount)
      }`,
    });
  }

  const userId = req.userId;
  if (
    (await User.findByIdAndDelete(userId)) &&
    (await Comment.deleteMany({ user: userId })) &&
    (await Post.deleteMany({ author: userId }))
  ) {
    res.cookie("jwt", "", { httpOnly: true, maxAge: 1 });
    return res.status(200).json({
      state: "success",
    });
  } else {
    res.cookie("jwt", "", { httpOnly: true, maxAge: 1 });
    return res.status(400).json({
      state: "failed",
    });
  }
});
