const mongoose = require('mongoose');
const bcrypt = require('bcrypt')


const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,"name is required"],
        maxlength : [15,"this name is too long"],
        minlength : [3,"this name is too short"],
        lowercase : true,
        trim : true,
    },
    password:{
        type : String,
        required : [true,"password is required"],
        maxlength : [25,"this password is too long"],
        minlength : [5,"this password is too short"],
        // select : false
    },

    passwordChangedAt : Date,

    profilePhoto: {
        type : String,
        default : "http://localhost:5000/defaultWebp.webp"
    },

    email : {
        type : String,
        required : [true,"email is required"],
        maxlength : [40,"this email is too long"],
        minlength : [8,"this email is too short"],
        trim : true,
        unique : true
    },
    bio : {
        type : String,
        maxlength : [800,"this bio is too long"],
        minlength : [8,"this bio is too short"],
        trim : true,
    },
    role : {
        type : String,
        enum : ["user" , "admin"],
        default : "user"
    }
    
    
},{ timestamps:true,
    toJSON : {virtuals:true},
    toObject:{virtuals:true}})


userSchema.virtual('userposts',{
    ref : "Posts",
    foreignField : "author",
    localField:"_id",
})

// userSchema.pre('save', async function(next){
//     this.password = await bcrypt.hash(this.password,11)
//     next()
// })

const User = mongoose.model('User',userSchema)

module.exports = User