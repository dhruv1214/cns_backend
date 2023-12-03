const Announcement = require('../models/announcement');

const AnnouncementService = {
    async listAnnouncements() {
        try {
            return await Announcement.find();
        } catch (error) {
            throw error;
        }
    },

    async getAnnouncementById(announcementId) {
        try {
            return await Announcement.findById(announcementId);
        } catch (error) {
            throw error;
        }
    },

    async createAnnouncement(announcementData) {
        try {
            const announcement = new Announcement(announcementData);
            return await announcement.save();
        } catch (error) {
            throw error;
        }
    },

    async updateAnnouncement(announcementId, announcementData) {
        try {
            return await Announcement.findByIdAndUpdate(announcementId, announcementData, { new: true });
        } catch (error) {
            throw error;
        }
    },

    async deleteAnnouncement(announcementId) {
        try {
            return await Announcement.findByIdAndDelete(announcementId);
        } catch (error) {
            throw error;
        }
    }
};

module.exports = AnnouncementService;
