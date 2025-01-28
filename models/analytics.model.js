const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  linkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Link",
    required: true,
  },
  ipAddress: String,
  device: String,
}, { timestamps: true });

const Analytic = mongoose.model("Analytic", analyticsSchema);

module.exports = Analytic;