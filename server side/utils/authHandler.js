const User = require("../models/userModel");
const asyncHandler = require("./asyncHandler");
const jwt = require("jsonwebtoken");

exports.protectRoute = asyncHandler(async (req, res, next) => {
  // check if jwt exists in cookie
  if (req.cookies?.jwt) {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (user) {
      console.log("autth");
      req.userId = decoded.userId;
      return next();
    }
  }
  console.log("no cookie");
  res.redirect("http://localhost:5000/api/v1/user/signin");
});

exports.adminValidation = async (req, res, next) => {

  if (!req.cookies?.jwt) return res.redirect("http://localhost:5000/api/v1/user/signin");

  const token = req.cookies.jwt;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (user && user.role === "admin") {
      req.userId = decoded.userId;
      return next();
    }

    res.clearCookie("jwt");
    return res.redirect("http://localhost:5000/api/v1/user/signin");
    
  } catch (err) {
    res.clearCookie("jwt");
    return res.redirect("http://localhost:5000/api/v1/user/signin");
  }
};
