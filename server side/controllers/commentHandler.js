const User = require("../models/userModel");
const Post = require("../models/postsModel");
const Comment = require('../models/comments')
const asyncHandler = require("../utils/asyncHandler");
const mongoose = require("mongoose");
const {likeFunction} = require('../utils/likeUnlike')


exports.getAllComments = asyncHandler(async(req, res , next)=>{

  // in big project with large amount of data , pagination be better from server side , but in small projects just do it client side to reduce amount of comunications between server and client

  const limit = 10; 
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;

  const allComments = await Comment.find().sort({createdAt:-1}).populate([{path : "user" , select : "_id name email profilePhoto"} , {path : "post" , select : "_id title"}]);

  const commentsCount = await Comment.countDocuments({})
  const paginationInfo = {
    currentPage : page,
    pagesNumber : commentsCount / limit
  }

  if (!allComments) return res.status(200).json({state : "no comments"}) 


  return res.status(200).json({ state: "success", data: allComments });

})


exports.getCommentsForSpecificPost =  asyncHandler(async(req , res , next)=>{
  const { id: postId } = req.params;
  if (mongoose.isValidObjectId(postId)) {
   const comments = await Comment.find({post : postId}).populate("user" , "_id name profilePhoto");
   if (comments) {
    return res.status(200).json({
        state: "success",
        data: comments,
      });
    } else {
      res.json({state : "no comments"});
    }}
    res.sendStatus(404);
  })

exports.makeComment = asyncHandler(async(req , res , next)=>{
    const { id: postId } = req.params;
    const userId = req.userId;
    const {message} = req.body
  
    if (mongoose.isValidObjectId(postId)) {
      const post = await Post.findById(postId)
      if(post){
        let comment = await Comment.create({
          user : userId,
          post : postId,
          comment : message
        })
    
        if(comment){
          comment = await comment.populate("user", "_id name profilePhoto")
          await comment.save()
          return res.status(200).json({
            state: "success",
            data: comment
        })};
      }else{
          res.sendStatus(404)
        }}
    res.sendStatus(404)
  })
  
  
exports.modifyComment = asyncHandler(async(req , res , next)=>{
    const {commentId} = req.params;
    const userId = req.userId;
    const {message} = req.body
  
    if (mongoose.isValidObjectId(commentId)) {
      const comment = await Comment.findById(commentId).populate("user", "_id name profilePhoto")
      if(comment){
        comment.comment = message
        await comment.save()
          return res.status(200).json({
            state: "success",
            data :  comment
        });
      }}
      res.sendStatus(404)
    })
  

exports.toggleLikeUnlikeComment = asyncHandler(async(req ,res ,next)=>{

    const { commentId } = req.params;
    await likeFunction( req , res ,commentId ,Comment )

})
  
exports.getCommentsForSpecificUser = asyncHandler(async(req , res ,next)=>{
    const limit = 10; 
    let page = parseInt(req.query.page) || 1;
    if(isNaN(page)) page = 1
    const skip = (page - 1) * limit;
    const userId = req.userId
    const allComments = await Comment.find({user : userId})
      .sort({createdAt:-1})
      .skip(skip)
      .limit(limit).populate("post" , "_id title")
      // needs refactor by removing else and change the order of the code.
    if (allComments) {
      res.status(200).json({
        state: "success",
        data: allComments,
      });
    } else {
      res.status(200).json({
        state: "no comments",
      })
    }
  });
  
  
exports.deleteComment = asyncHandler(async(req ,res ,next)=>{

  // for admin only
  const listOfDeletedIds = req.body

  console.log(listOfDeletedIds)
  if(listOfDeletedIds && Array.isArray(listOfDeletedIds)){
    const result = await Comment.deleteMany({_id : {$in : listOfDeletedIds}})
    return res.status(200).json({
      state : `deleted comments : ${result.deletedCount}`
    })
  }
  
  const { commentId } = req.params;
  console.log(commentId)
  if (mongoose.isValidObjectId(commentId)) {
    await Comment.deleteMany({$or : [{_id : commentId} , {parentComment : commentId}]})
    return res.status(200).json({
      state: "success",
    })} 
    res.sendStatus(404)
  })
  

  
