const express = require('express');
const router = express.Router();
const BuildingController = require('../controllers/BuildingController');
const { validate, buildingValidators } = require('../middleware/validators');

router.get('', BuildingController.listBuildings);
router.get('/:id', validate(buildingValidators.getBuilding), BuildingController.getBuilding);
router.post('', validate(buildingValidators.createBuilding), BuildingController.createBuilding);
router.put('/:id', validate(buildingValidators.updateBuilding), BuildingController.updateBuilding);
router.delete('/:id', validate(buildingValidators.deleteBuilding), BuildingController.deleteBuilding);

module.exports = router;
