const asyncHandler = require("express-async-handler"); //case async function==>With it (wrapping the fct) we can work without try catch
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, please login");
  }
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(verified.id).select("-password");
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  req.user = user;
  next();
});

module.exports = protect;