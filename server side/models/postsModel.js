const mongoose = require('mongoose');
const Comment = require('./comments');

const postSchema = new mongoose.Schema({
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },

    title : {
        type : String,
        required : [true,"title is required"],
        minlength : [5,"this title is too short"],
        trim : true,
    },
    description : {
        type : String,
        required : [true,"description is required"],
        minlength : [25,"this description is too short"],
        trim : true,
    },
    subject : {
        type : String,
        required : [true,"subject is required"],
        minlength : [50,"this subject is too short"],
    },

    likes : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }],
    cover : {
        type : String,
        required : [true , "post cover is required"]
    }
},
{timestamps:true,
 toJSON:{virtuals : true},
 toObject:{virtuals : true}    
})

postSchema.virtual("comments",{
    ref: "Comment",
    foreignField : "post",
    localField : "_id"
})


const Post = mongoose.model('Post',postSchema)
module.exports = Post