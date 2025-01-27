const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    originalLink:{
        type: String,
        required: [true, "Original Link is required"]
    },
    shortLink:{
        type: String,
        required: [true, "Short link is required"]
    },
    remarks:{
        type: String,
        required: true
    },
    clicks: Number,
    expiryDate: Date,
    ipAddress: String,
    device: String
}, {timestamps: true});

const Link = mongoose.model("Link", linkSchema);

module.exports = Link;