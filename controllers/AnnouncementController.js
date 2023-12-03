const AnnouncementService = require('../services/AnnouncementService');

const AnnouncementController = {
    async listAnnouncements(req, res) {
        try {
            const announcements = await AnnouncementService.listAnnouncements();
            res.json(announcements);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    async getAnnouncement(req, res) {
        try {
            const { id } = req.params;
            const announcement = await AnnouncementService.getAnnouncementById(id);
            if (!announcement) {
                return res.status(404).send('Announcement not found');
            }
            res.json(announcement);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    async createAnnouncement(req, res) {
        try {
            const announcement = await AnnouncementService.createAnnouncement(req.body);
            res.status(201).json(announcement);
        } catch (error) {
            res.status(400).send(error.message);
        }
    },

    async updateAnnouncement(req, res) {
        try {
            const { id } = req.params;
            const announcement = await AnnouncementService.updateAnnouncement(id, req.body);
            if (!announcement) {
                return res.status(404).send('Announcement not found');
            }
            res.json(announcement);
        } catch (error) {
            res.status(400).send(error.message);
        }
    },

    async deleteAnnouncement(req, res) {
        try {
            const { id } = req.params;
            const success = await AnnouncementService.deleteAnnouncement(id);
            if (!success) {
                return res.status(404).send('Announcement not found');
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
};

module.exports = AnnouncementController;