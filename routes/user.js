const express = require("express");
const User = require("../models/user.models");
const bcrypt = require("bcrypt");
const router = express.Router();
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/auth");
dotenv.config();
const secretKey = process.env.JWT_Secret;

router.get("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/register", async (req, res) => {
  const { username, email, mobile, password, confirmPassword } = req.body;
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    return res.status(400).json({ message: "User already exist" });
  }
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ message: "Enter same password in both fields" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    const newUser = await User.create({
      username,
      email,
      mobile,
      password: hashPassword,
    });
    return res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json({ message: "Either Email is wrong or Password is wrong" });
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res
      .status(400)
      .json({ message: "Either Email is wrong or Password is wrong" });
  }
  try {
    const payload = {
      id: user._id,
    };
    const token = await jwt.sign(payload, secretKey);
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "User cannot login", error: error.message });
  }
});

router.put("/update", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { email, username, mobile } = req.body;
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    return res.status(400).json({ message: "User does not exist" });
  }
  try {
    if (email) {
      const isEmailExist = await User.findOne({ email });
      if (isEmailExist) {
        return res.status(400).json({ message: "Email already exist" });
      }
      isUserExist.email = email;
    }
    if (mobile) isUserExist.mobile = mobile;
    if (username) isUserExist.username = username;
    await isUserExist.save();
    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/delete", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({ message: "Missing credentials" });
  }
  try {
    await User.findByIdAndDelete(userId);
    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
