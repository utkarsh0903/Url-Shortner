const express = require("express");
const User = require("../models/user.models");
const bcrypt = require("bcrypt");
const router = express.Router();

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
    return res
      .status(500)
      .json({ message: error.message });
  }
});



module.exports = router;
