const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    post :{
        type:mongoose.Schema.Types.ObjectId,
        ref : "Post",
        required : true,
        
    },
    comment : {
        type : String,
        required : true
    },

    likes :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
}],
    isReply : {
        type : Boolean,
        default : false
    },

    // If it is reply

    parentComment :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Comment"
    },
    
    // It is better to make replies as embeded documents in small projects but in large projects it is better to only ref  
    // replies as the max size of doucument is 16mb in mongodb . Here i made it as ref to stimulate large projects. :)

    replies :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Comment"
    }]
},{timestamps : true})

commentSchema.index({
    post : -1,
    user : -1
})

const Comment = mongoose.model("Comment",commentSchema)
module.exports = Comment