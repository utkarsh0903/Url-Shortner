const express = require("express");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();
const bcrypt = require("bcrypt");
const Link = require("../models/link.models");
const useragent = require("useragent");
const Analytic = require("../models/analytics.model");

router.get("/links", authMiddleware, async (req, res) => {
  const user = req.user.id;
  const { offset, limit, remarks, isDatesSorted } = req.query;
  try {
    const query = { user };

    if (remarks) {
      query.remarks = { $regex: remarks, $options: "i" };
    }

    const sortedLinks = { createdAt: isDatesSorted === "true" ? 1 : -1 }; 

    const userLinks = await Link.find(query)
      .sort(sortedLinks)
      .skip(Number(offset) || 0)
      .limit(Number(limit) || 10);

    const totalLinks = await Link.countDocuments(query);
    return res.status(200).json({ userLinks, totalLinks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:shortURL", async (req, res) => {
  const { shortURL } = req.params;

  try {
    const url = await Link.findOne({
      shortLink: `${req.protocol}://${req.get("host")}/api/link/${shortURL}`,
    });

    if (url) {
      const isActive = !url.expiryDate || new Date(url.expiryDate) > new Date();

      if (!isActive) {
        return res.status(400).json({ error: "This link is inactive" });
      }

      url.clicks += 1;

      const deviceIPAddress =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress;

      const agent = useragent.parse(req.headers["user-agent"]);

      await Analytic.create({
        linkId: url._id,
        ipAddress: deviceIPAddress,
        device: agent.family,
      });

      await url.save();
      return res.status(200).redirect(url.originalLink);
    } else {
      return res.status(400).json({ error: "Link is not valid" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/new-link", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { originalLink, remarks, expiryDate } = req.body;
  if (!originalLink) {
    return res.status(400).json({ message: "Please enter Destination URL" });
  }
  try {
    const salt = await bcrypt.genSalt(2);
    const hashedURL = await bcrypt.hash(originalLink, salt);
    const shortURL = hashedURL.replace(/\W/g, "").slice(0, 8);
    const shortLink = `${req.protocol}://${req.get(
      "host"
    )}/api/link/${shortURL}`;
    const newURL = await Link({
      user: userId,
      originalLink: originalLink,
      shortLink: shortLink,
      remarks,
      expiryDate,
      clicks: 0,
    });
    await newURL.save();
    return res
      .status(200)
      .json({ newURL, message: "URL generated succesfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put("/update-link", authMiddleware, async (req, res) => {
  const { originalLink, linkId, remarks, expiryDate } = req.body;
  console.log(originalLink, remarks, expiryDate);

  const isLinkExist = await Link.findById(linkId);
  if (!isLinkExist) {
    return res.status(400).json({ message: "Link does not exist" });
  }
  try {
    isLinkExist.originalLink = originalLink;
    isLinkExist.remarks = remarks;
    isLinkExist.expiryDate = expiryDate;
    await isLinkExist.save();
    console.log(isLinkExist);
    return res.status(200).json({ message: "Link updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/delete/:linkId", authMiddleware, async (req, res) => {
  const { linkId } = req.params;
  try {
    await Link.findByIdAndDelete(linkId);
    return res.status(200).json({
      message: "Link deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
