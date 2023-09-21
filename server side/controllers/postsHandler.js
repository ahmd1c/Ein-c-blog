const User = require("../models/userModel");
const Post = require("../models/postsModel");
const Comment = require('../models/comments')
const asyncHandler = require("../utils/asyncHandler");
const mongoose = require("mongoose");
const {likeFunction} = require('../utils/likeUnlike')


exports.createNewPost = asyncHandler(async (req, res, next) => {
  // getting author(userId) from req.userId which we set in authentication middleware
  const author = req.userId;
  const { title, subject , description } = req.body;
  const image = req.file
  console.log(image)

  if (mongoose.isValidObjectId(author)) {
    const post = await Post.create({
      author: author,
      title: title,
      description : description,
      subject: subject,
      cover : `http://localhost:5000/${image.filename}`
    });
    res.status(200).json({
      state: "success",
      data: post,
    });
  } else {
    res.status(400).json({
      state: "failed",
      data: "please sign in again",
    });
  }
});

exports.getAllPosts = asyncHandler(async (req, res, next) => {
  
  // this for pagination .. but i will do client side pagingation in this project as it has small data .

  const limit = 10; 
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;

  const allPosts = await Post.find().sort({createdAt:-1}).skip(skip).limit(limit).populate("author", "_id name profilePhoto");

  const postsCount = await Post.countDocuments({})
  const pagesNumber = Math.ceil(postsCount / limit)
  const hasMore = page < pagesNumber

  console.log(hasMore)
  console.log(pagesNumber)
  console.log(postsCount)
  console.log(page)

  const paginationInfo = {
    currentPage : page,
    pagesNumber ,
    hasMore
  }

  if (!allPosts) return res.status(200).json({state : "no posts"}) 
  

  return res.status(200).json({ state: "success", data: allPosts , paginationInfo });

  
});


exports.getAllPostsForSpecificUser = asyncHandler(async (req, res, next) => {
  const limit = 10; 
  let page = parseInt(req.query.page) || 1;
  if(isNaN(page)) page = 1
  const skip = (page - 1) * limit;
  const userId = req.params.userId
  const allPosts = await Post.find({author : userId})
    .sort({createdAt:-1})
    .skip(skip)
    .limit(limit)

  if (allPosts) {
    res.status(200).json({
      state: "success",
      data: allPosts,
    });
  } else {
    res.status(200).json({
      state: "no posts",
    })
  }
});


exports.getSpecificPost = asyncHandler(async (req, res, next) => {

  const { id: postId } = req.params;
  if (mongoose.isValidObjectId(postId)) {
    const post = await Post.findOne({_id : postId}).populate("author", "_id name profilePhoto");
    const commentsCount = await Comment.countDocuments({post : post?._id})
    if (post) {
      
      return res.status(200).json({
        state: "success",
        data:  post,
        commentsCount : commentsCount || commentsCount === 0 ? commentsCount : null
      })
    }} 
    res.sendStatus(404);
});

exports.toggleLikeUnlike = asyncHandler(async(req ,res ,next )=>{

  const { id: postId } = req.params;

  await likeFunction( req , res ,postId ,Post )

});

exports.updatePost = asyncHandler(async(req ,res ,next)=>{
  const { id: postId } = req.params;
  const {title , description , subject} = req.body
  let image
  if (mongoose.isValidObjectId(postId)){
  if(req.file) image = req.file
  
  const post = await Post.findByIdAndUpdate(
    postId,
    {
      $set: { title, description, subject ,cover: image ? `http://localhost:5000/${image.filename}` : undefined },
    },
    { new: true }
  ).populate("author", "_id name profilePhoto")

  if (post){
    console.log("rerererererere")
    return res.json({
      state: "success",
      data: post,
    }); 
  }

  }
  return res.sendStatus(404)
})

exports.deletePost = asyncHandler(async(req ,res ,next)=>{
  
// for admin only
const listOfDeletedIds = req.body

console.log(listOfDeletedIds)
if(listOfDeletedIds && Array.isArray(listOfDeletedIds)){
  const postsResult = await Post.deleteMany({_id : {$in : listOfDeletedIds}})
  const commentsResult = await Comment.deleteMany({post : {$in : listOfDeletedIds}})
  return res.status(200).json({
    state : `deleted states : ${postsResult.deletedCount , commentsResult.deletedCount }`
  })
}

  const { id: postId } = req.params;
  if (mongoose.isValidObjectId(postId)) {
    if (await Post.findOneAndDelete({_id :  postId , author : req.userId}) &&  await Comment.deleteMany({post : postId})) {
      return res.status(200).json({
        state: "success",
      })
    }} 
    res.sendStatus(404)
})

