const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  email: {
    type: String,
    unique: [true, "Email should be unique"],
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  mobile: {
    type: Number,
    required: [true, "Password is required"],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
