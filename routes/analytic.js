const express = require("express");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();
const Link = require("../models/link.models.js");
const Analytic = require("../models/analytics.model");

router.get("/analytics", authMiddleware, async (req, res) => {
  const user = req.user.id;
  const { offset, limit } = req.query;
  try {
    const links = await Link.find({ user }).select("_id originalLink shortLink");

    const userlinkIds = links.map(link => link._id);

    const analyticsData = await Analytic.find({ linkId: { $in: userlinkIds } })
      .skip(Number(offset))
      .limit(Number(limit))
      .populate("linkId", "originalLink shortLink");

    const totallinks = await Analytic.countDocuments({ linkId: { $in: userlinkIds } });

    return res.status(200).json({ analyticsData, totallinks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
