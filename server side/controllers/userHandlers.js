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
  console.log("done done");
  // in productivity it is important to set secure property to true
  res.cookie("jwt", token, {
    maxAge: 1000 * 60 * 60 * 24 * 20,
    httpOnly: true,
  });
  console.log("hhhhhdone done");
}

exports.signUp = asyncHandler(async (req, res, next) => {
  const { name, password, repeatPassword, email } = req.body;
  const user = await User.create({
    name: name,
    password: password,
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
  // if(user && await bcrypt.compare(password,user.password))
  if (user && password === user.password) {
    createTokenAndCookie(user._id, res);
    // res.cookie("wwww" , "vvvvvvv" , { maxAge : 1000 * 60})
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
  console.log("reached");
  res.cookie("jwt", "", { httpOnly: true, maxAge: 1 });
  res.end();
});

/**
 * @access only admin
 */
exports.getAllUsers = asyncHandler(async (req ,res, next)=>{

  // we will do client side pagination for trainig as data is small but in large app it is better to do it server side ... i will leave the pagination code here .

  // let page = parseInt(req.query.page) || 1

  // if(isNaN(page)) page = 1

  // const limit = 10; // we can allow admin in client side to choose and receive it via req.query but I'm the admin :)
  // const skip = (page - 1) * limit

  const users = await User.find({})
  const usersCount = await User.countDocuments({})

  // const paginationInfo = {
  //   currentPage : page,
  //   pagesNumber : usersCount / limit
  // }

  if(!users) return res.status(200).json({state : "no users"})

  return res.status(200).json({ state: "success", data: users });

})


exports.updateProfile = asyncHandler(async (req, res, next) => {
  const { name, bio } = req.body;
  const image = req.file || req.body?.image
  // here the code of cloudinary or db
  // if(image){}
  const userId = req.userId;
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: { name, bio, profilePhoto: image?.filename ? `http://localhost:5000/${image.filename}` : `http://localhost:5000/${image}` },
    },
    { new: true }
  ).select("-password");

  if (!user) return res.sendStatus(404);

  return res.json({
    status: "success",
    data: user,
  });
});


exports.changePassword = asyncHandler(async(req , res, next)=>{
  const userId = req.userId;
  const {currentPassword , newPassword} = req.body;

  const user = await User.findById(userId)
  // if(user && await bcrypt.compare(password,user.password))
  if (!(user && currentPassword === user.password))
  return res.status(400).json({
    state : "invalid credentials"
    })

  user.password = newPassword
  await user.save()
  res.cookie("jwt", "", { httpOnly: true, maxAge: 1 })
  return res.status(200).json({
    state : "success"
  })
  
})


exports.getLikesForUser = asyncHandler(async(req , res , next)=>{
  const userId = req.userId;
  const postsLikes = await Post.find({likes : userId})
  const commentsLikes = await Comment.find({likes : userId})
  
  if(postsLikes || commentsLikes) 

   return res.status(200).json({
    state : "success",
    postsLikes,
    commentsLikes
   }) 
   
   return res.status(200).json({
    state : "no likes"
   })
})


exports.deleteUserAccount = asyncHandler(async (req, res, next) => {

// for admin only
const listOfDeletedIds = req.body

console.log(listOfDeletedIds)
if(listOfDeletedIds && Array.isArray(listOfDeletedIds)){

  const usersResult = await User.deleteMany({_id : {$in : listOfDeletedIds}})
  const commentsResult = await Comment.deleteMany({user : {$in : listOfDeletedIds}})
  const postsResult = await Post.deleteMany({author : {$in : listOfDeletedIds}})

  return res.status(200).json({
    state : `deleted states : ${usersResult.deletedCount , commentsResult.deletedCount , postsResult.deletedCount}`
  })
}


  const userId = req.userId;
  if(!userId) return res.sendStatus(404) 
  if (
    (await User.findByIdAndDelete(userId)) &&
    (await Comment.deleteMany({ user: userId })) &&
    (await Post.deleteMany({ author: userId }))
  ) {

    res.cookie("jwt", "", { httpOnly: true, maxAge: 1 });
    return res.status(200).json({
      state: "success",
    });
  }else{

    res.cookie("jwt", "", { httpOnly: true, maxAge: 1 });
    return res.status(400).json({
      state : "failed"
    })
  }
});
