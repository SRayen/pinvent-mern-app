const asyncHandler = require("express-async-handler"); //case async function==>With it (wrapping the fct) we can work without try catch
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Token = require("../models/tokenModel");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

//REGISTER USER
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  //Validations
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be up to 6 characters");
  }
  //Check if user email already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Email has already been registered");
  }

  //Create new user

  const user = await User.create({
    name,
    email,
    password,
  });

  //Generate Token
  const token = generateToken(user._id);

  //Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 24 * 60 * 60), //1 day
    secure: true, //only used with https
    sameSite: "None", //cross-site cookie (back and front can have different url)
  });

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({ _id, name, email, photo, phone, bio, token });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//LOGIN USER
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please add an email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User not found, please signUp");
  }
  const isMatch = await bcrypt.compare(password, user.password);

  //Generate Token
  const token = generateToken(user._id);

  //Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 24 * 60 * 60), //1 day
    secure: true, //only used with https
    sameSite: "None", //cross-site cookie (back and front can have different url)
  });

  if (user && isMatch) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({ _id, name, email, photo, phone, bio, token });
  } else {
    res.status(400);
    throw new Error("Invalid email or password ");
  }
});

//LOGOUT USER
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), //Expire
    secure: true, //only used with https
    sameSite: "None", //cross-site cookie (back and front can have different url)
  });
  return res.status(200).json({ message: "Successfully Logged Out" });
});

//GET USER DATA
const getUser = asyncHandler(async (req, res) => {
  //req have already the logged In user (thanks to authMiddleware: req.user = user)
  const user = await User.findById(req.user._id);
  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({ _id, name, email, photo, phone, bio });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

//GET LOGIN STATUS
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }
  //the token is valid and has not expired
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  }
  return res.json(false);
});

//UPDATE USER
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  console.log("user", user);
  if (user) {
    const { name, email, photo, phone, bio } = user;
    user.email = email;
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;
    user.photo = req.body.photo || photo;

    console.log("updated user", user);

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      photo: updatedUser.photo,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

//CHANGE PASSWORD
const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { oldPassword, password } = req.body;
  //validate
  if (!user) {
    res.status(400);
    throw new Error("User not found, please signup");
  }
  if (!oldPassword || !password) {
    res.status(400);
    throw new Error("Please add old and new password");
  }
  //Check if old password matches password in DB
  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

  //Save new Password
  if (user && passwordIsCorrect) {
    user.password = password;
    await user.save();
    res.status(200).send("Password change successful");
  } else {
    res.status(400);
    throw new Error("Old password is incorrect");
  }
});

//FORGOT PASSWORD

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User does not exist");
  }

  //Delete token if it exists in DB (old token : already send)
  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }
  //Create Reset Token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  console.log("resetToken:", resetToken);
  //Hash token before saving to DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  //Save Token to DB
  await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000), //30 min
  }).save();

  //Construct Reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  //Reset Email
  const message = `
<h2>Hello ${user.name}</h2>
<p>Please use the url below to reset your password</p>
<p>This reset link is valid for only 30 minutes</p>
<a href=${resetUrl} clicktracking=off>${resetUrl}</a>
<p>Regards ...</p>
<p>***RAYEN DEV COMMUNITY***</p>
`;

  const subject = "Password Reset Request";
  const send_to = user.email;
  const send_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, send_to, send_from);
    res.status(200).json({ success: true, message: "Reset Email Sent" });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent, please try again");
  }
});

//RESET PASSWORD
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  //Hash token , then compare to Token in DB

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //Find token in DB
  const userToken = await Token.findOne({
    token: hashedToken,
    //$gt : greater than
    expiresAt: { $gt: Date.now() },
  });
  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or Expired Token");
  }
  //Find User
  const user = await User.findOne({ _id: userToken.userId });
  user.password = password;
  await user.save();
  res.status(200).json({
    message: "Password Reset Successful, Please Login",
  });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
};
