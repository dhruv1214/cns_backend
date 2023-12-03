const LocationService = require('../services/LocationService');

const LocationController = {
    async listLocations(req, res) {
        try {
            const locations = await LocationService.listLocations();
            res.json(locations);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    async getLocation(req, res) {
        try {
            const { id } = req.params;
            const location = await LocationService.getLocationById(id);
            if (!location) {
                return res.status(404).send('Location not found');
            }
            res.json(location);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    async getLocationByBuildingId(req, res) {
        try {
            const { id } = req.params;
            const location = await LocationService.getLocationByBuildingId(id);
            if (!location) {
                return res.status(404).send('Location not found');
            }
            res.json(location);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    async createLocation(req, res) {
        try {
            const location = await LocationService.createLocation(req.body);
            res.status(201).json(location);
        } catch (error) {
            res.status(400).send(error.message);
        }
    },

    async updateLocation(req, res) {
        try {
            const { id } = req.params;
            const location = await LocationService.updateLocation(id, req.body);
            if (!location) {
                return res.status(404).send('Location not found');
            }
            res.json(location);
        } catch (error) {
            res.status(400).send(error.message);
        }
    },

    async deleteLocation(req, res) {
        try {
            const { id } = req.params;
            const success = await LocationService.deleteLocation(id);
            if (!success) {
                return res.status(404).send('Location not found');
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    async getDistanceAndPathBetweenLocations(req, res) {
        try {
            const { start, end } = req.params;
            const result = await LocationService.getDistanceAndPathBetweenLocations(start, end);
            res.json(result);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
};

module.exports = LocationController;