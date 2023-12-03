const PathService = require('../services/PathService');

const PathController = {
    async listPaths(req, res) {
        try {
            const paths = await PathService.listPaths();
            res.json(paths);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    async getPath(req, res) {
        try {
            const { id } = req.params;
            const path = await PathService.getPathById(id);
            if (!path) {
                return res.status(404).send('Path not found');
            }
            res.json(path);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    async createPath(req, res) {
        try {
            const path = await PathService.createPath(req.body);
            res.status(201).json(path);
        } catch (error) {
            res.status(400).send(error.message);
        }
    },

    async updatePath(req, res) {
        try {
            const { id } = req.params;
            const path = await PathService.updatePath(id, req.body);
            if (!path) {
                return res.status(404).send('Path not found');
            }
            res.json(path);
        } catch (error) {
            res.status(400).send(error.message);
        }
    },

    async deletePath(req, res) {
        try {
            const { id } = req.params;
            const success = await PathService.deletePath(id);
            if (!success) {
                return res.status(404).send('Path not found');
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
};

module.exports = PathController;