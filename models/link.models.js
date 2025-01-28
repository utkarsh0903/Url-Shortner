const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    ipAddress: String,
    device: String,
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const linkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    originalLink: {
      type: String,
      required: [true, "Original Link is required"],
    },
    shortLink: {
      type: String,
      required: [true, "Short link is required"],
    },
    remarks: {
      type: String,
      required: true,
    },
    clicks: { type: Number, default: 0 },
    expiryDate: Date,
    analytics: { type: [analyticsSchema], default: [] },
  },
  { timestamps: true }
);

const Link = mongoose.model("Link", linkSchema);

module.exports = Link;
