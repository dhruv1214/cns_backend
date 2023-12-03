const POIService = require('../services/POIService');

const POIController = {
    async listPOIs(req, res) {
        try {
            const pois = await POIService.listPOIs();
            res.json(pois);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    async getPOI(req, res) {
        try {
            const { id } = req.params;
            const poi = await POIService.getPOIById(id);
            if (!poi) {
                return res.status(404).send('POI not found');
            }
            res.json(poi);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    async createPOI(req, res) {
        try {
            const poi = await POIService.createPOI(req.body);
            res.status(201).json(poi);
        } catch (error) {
            res.status(400).send(error.message);
        }
    },

    async updatePOI(req, res) {
        try {
            const { id } = req.params;
            const poi = await POIService.updatePOI(id, req.body);
            if (!poi) {
                return res.status(404).send('POI not found');
            }
            res.json(poi);
        } catch (error) {
            res.status(400).send(error.message);
        }
    },

    async deletePOI(req, res) {
        try {
            const { id } = req.params;
            const success = await POIService.deletePOI(id);
            if (!success) {
                return res.status(404).send('POI not found');
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
};

module.exports = POIController;
