const express = require('express');
const AnnouncementController = require('../controllers/AnnouncementController');
const router = express.Router();
const { validate, announcementValidators } = require('../middleware/validators');

router.get('', AnnouncementController.listAnnouncements);
router.get('/:id', validate(announcementValidators.getAnnouncement), AnnouncementController.getAnnouncement);
router.post('', validate(announcementValidators.createAnnouncement), AnnouncementController.createAnnouncement);
router.put('/:id', validate(announcementValidators.updateAnnouncement), AnnouncementController.updateAnnouncement);
router.delete('/:id', validate(announcementValidators.deleteAnnouncement), AnnouncementController.deleteAnnouncement);

module.exports = router;