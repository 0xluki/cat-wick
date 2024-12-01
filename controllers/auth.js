const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const JWT_SECRET = "topsecrettoken";

exports.postSignUp = async (req, res, next) => {
  const { email, password, name } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const error = new Error("email already exists");
      error.status = 400;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email: email,
      password: hashedPassword,
      name: name,
    });
    await newUser.save();
    res.status(201).json({
      message: "account created sucessfully",
      email: email,
    });
  } catch (error) {
    next(error);
  }
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("Invalid credentials");
      error.status = 401;
      throw error;
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      const error = new Error("Invalid credentials");
      error.status = 401;
      throw error;
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({
      message: "login successful",
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

exports.isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      const error = new Error("not authenticated");
      error.status = 401;
      throw error;
    }
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, JWT_SECRET);
    if (!decodedToken) {
      const error = new Error("not authenticated");
      error.status = 401;
      throw error;
    }
    req.userId = decodedToken.userId;
    req.email = decodedToken.email;
    next();
  } catch (error) {
    next(error);
  }
};
