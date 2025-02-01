const express = require("express");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();
const Link = require("../models/link.models.js");
const Analytic = require("../models/analytics.model");

router.get("/analytics", authMiddleware, async (req, res) => {
  const user = req.user.id;
  const { offset, limit, isDatesSorted } = req.query;
  try {
    const links = await Link.find({ user }).select(
      "_id originalLink shortLink"
    );

    const userlinkIds = links.map((link) => link._id);

    const analyticsData = await Analytic.find({ linkId: { $in: userlinkIds } })
      .sort({ createdAt: isDatesSorted === "true" ? 1 : -1 })
      .skip(Number(offset))
      .limit(Number(limit))
      .populate("linkId", "originalLink shortLink");

    const totalLinks = await Analytic.countDocuments({
      linkId: { $in: userlinkIds },
    });

    return res.status(200).json({ analyticsData, totalLinks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/clicks", authMiddleware, async (req, res) => {
  const user = req.user.id;
  try {
    const links = await Link.find({ user });

    const totalClicksCount = links.reduce(
      (acc, link) => acc + (link.clicks || 0),
      0
    );

    const userlinkIds = links.map((link) => link._id);

    const analyticsData = await Analytic.find({ linkId: { $in: userlinkIds } });

    const datewiseClicks = {};
    const deviceClicks = {};

    analyticsData.forEach((info) => {
      const date = new Date(info.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });

      datewiseClicks[date] = (datewiseClicks[date] || 0) + 1;

      const typeOfDevice = info.device || "Unknown";
      deviceClicks[typeOfDevice] = (deviceClicks[typeOfDevice] || 0) + 1;
    });

    return res.status(200).json({
      totalClicks: totalClicksCount,
      datewiseClicks,
      deviceClicks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
