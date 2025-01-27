const express = require("express");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();
const bcrypt = require("bcrypt");
const Link = require("../models/link.models");

router.post("/new-link", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { originalURL, remarks, expiryDate } = req.body;
  if (!originalURL) {
    return res.status(400).json({ message: "Please enter Destination URL" });
  }
  try {
  const salt = await bcrypt.genSalt(2);
  const hashedURL = await bcrypt.hash(originalURL, salt);
  const shortURL = hashedURL.replace(/\W/g, "").slice(0, 8);
  const shortLink = `${req.protocol}://${req.get("host")}/api/link/${shortURL}`;
  console.log(shortLink);
    const newURL = await Link({
      user: userId,
      originalLink: originalURL,
      shortLink: shortLink,
      remarks,
      expiryDate,
    });
    await newURL.save();
    return res
      .status(200)
      .json({ newURL, message: "URL generated succesfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/:shortURL", async (req, res) => {
  const { shortURL } = req.params;

  try {
    const url = await Link.findOne({ shortLink: `${req.protocol}://${req.get("host")}/api/link/${shortURL}` });

    if (url) {
      return res.status(200).redirect(url.originalLink);
    } else {
      return res.status(400).json({ error: "Link is not valid" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  const user = req.user.id;

  try {
    const userLinks = await Link.find({ user });
    return res.status(200).json({ userLinks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
