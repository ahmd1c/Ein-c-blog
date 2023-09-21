const User = require("../models/userModel");
const Comment = require('../models/comments')
const asyncHandler = require("../utils/asyncHandler");
const mongoose = require("mongoose");
const {likeFunction} = require('../utils/likeUnlike')


exports.getRepliesForSpecificComment = asyncHandler(async(req , res , next)=>{
  const { id: postId , commentId : parentId} = req.params;
  if (mongoose.isValidObjectId(postId) && mongoose.isValidObjectId(parentId)) {
   const replyComments = await Comment.find({parentComment : parentId}).populate("user" , "_id name profilePhoto");
   if (replyComments) {
    return res.status(200).json({
        state: "success",
        data: replyComments,
      });
    } else {
      res.json({state : "no comments"});
    }}
    res.sendStatus(404);
  })



exports.makeReply = asyncHandler(async(req , res , next)=>{
    const { id: postId  , commentId} = req.params;
    const userId = req.userId;
    const {message} = req.body
  
    if (mongoose.isValidObjectId(postId) && mongoose.isValidObjectId(commentId)) {
    // next line is enough to be sure that post and comment is not deleted as if we delete the post its comments will be     
    // deleted automatically , the previous line is only for practice :)
      const comment = await Comment.findById(commentId)  
      if( comment){
        const reply = await Comment.create({
          user : userId,
          post : postId,
          comment : message,
          isReply : true,
          parentComment : commentId
        })
        if(reply){
          comment.replies.push(reply._id)
          await comment.save()
          await reply.populate("user","_id name profilePhoto")
          await reply.save()
          return res.status(200).json({
            state: "success",
            data: reply
          });
        }}}
    res.sendStatus(404)
  })
  
  
exports.toggleLikeUnlikeReply = asyncHandler(async(req ,res ,next)=>{
    const { replyId } = req.params;
  
    await likeFunction( req , res ,replyId ,Comment )

})
  
  
  exports.modifyReply = asyncHandler(async(req , res , next)=>{
    const {replyId} = req.params;
    const userId = req.userId;
    const {message} = req.body
  
    if (mongoose.isValidObjectId(replyId)) {
      const reply = await Comment.findById(replyId)
      if(reply){
        reply.comment = message
        await reply.populate("user" , "_id name profilePhoto")
        await reply.save()
          return res.status(200).json({
            state: "success",
            data :  reply
        });
      }}
      res.sendStatus(404)
    })
  
    
  exports.deleteReply = asyncHandler(async(req ,res ,next)=>{
  
    const { id: postId , commentId , replyId } = req.params;
    if (mongoose.isValidObjectId(commentId) && mongoose.isValidObjectId(postId) && mongoose.isValidObjectId(replyId)) {
  
      if (await Comment.findByIdAndUpdate(commentId,{$pull:{replies:replyId}}) && await Comment.findByIdAndDelete(replyId)) {
        return res.status(200).json({
          state: "success",
        })
      }} 
      res.sendStatus(404)
  })