const EventService = require('../services/EventService');

const EventController = {
    async listEvents(req, res) {
        try {
            const events = await EventService.listEvents();
            res.json(events);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    async getEvent(req, res) {
        try {
            const { id } = req.params;
            const event = await EventService.getEventById(id);
            if (!event) {
                return res.status(404).send('Event not found');
            }
            res.json(event);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    async createEvent(req, res) {
        try {
            const event = await EventService.createEvent(req.body);
            res.status(201).json(event);
        } catch (error) {
            res.status(400).send(error.message);
        }
    },

    async updateEvent(req, res) {
        try {
            const { id } = req.params;
            const event = await EventService.updateEvent(id, req.body);
            if (!event) {
                return res.status(404).send('Event not found');
            }
            res.json(event);
        } catch (error) {
            res.status(400).send(error.message);
        }
    },

    async deleteEvent(req, res) {
        try {
            const { id } = req.params;
            const success = await EventService.deleteEvent(id);
            if (!success) {
                return res.status(404).send('Event not found');
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
};

module.exports = EventController;