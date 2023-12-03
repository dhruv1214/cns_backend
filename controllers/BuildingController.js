const BuildingService = require('../services/BuildingService');

const BuildingController = {
    async listBuildings(req, res) {
        try {
            const buildings = await BuildingService.listBuildings();
            res.json(buildings);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    async getBuilding(req, res) {
        try {
            const { id } = req.params;
            const building = await BuildingService.getBuildingById(id);
            if (!building) {
                return res.status(404).send('Building not found');
            }
            res.json(building);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    async createBuilding(req, res) {
        try {
            const building = await BuildingService.createBuilding(req.body);
            res.status(201).json(building);
        } catch (error) {
            res.status(400).send(error.message);
        }
    },

    async updateBuilding(req, res) {
        try {
            const { id } = req.params;
            const building = await BuildingService.updateBuilding(id, req.body);
            if (!building) {
                return res.status(404).send('Building not found');
            }
            res.json(building);
        } catch (error) {
            res.status(400).send(error.message);
        }
    },

    async deleteBuilding(req, res) {
        try {
            const { id } = req.params;
            const success = await BuildingService.deleteBuilding(id);
            if (!success) {
                return res.status(404).send('Building not found');
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
};

module.exports = BuildingController;
