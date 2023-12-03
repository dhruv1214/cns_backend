const express = require('express');
const EventController = require('../controllers/EventController');
const router = express.Router();
const { validate, eventValidators } = require('../middleware/validators');

router.get('', EventController.listEvents);
router.get('/:id', validate(eventValidators.getEvent), EventController.getEvent);
router.post('', validate(eventValidators.createEvent), EventController.createEvent);
router.put('/:id', validate(eventValidators.updateEvent), EventController.updateEvent);
router.delete('/:id', validate(eventValidators.deleteEvent), EventController.deleteEvent);

module.exports = router;