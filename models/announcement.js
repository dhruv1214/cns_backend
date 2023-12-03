const mongoose = require("mongoose");
const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: Date
});

const Announcement = mongoose.model('Announcement', announcementSchema);
module.exports = Announcement;
