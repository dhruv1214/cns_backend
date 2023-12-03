const express = require('express');
const POIController = require('../controllers/POIController');
const router = express.Router();
const { validate, poiValidators } = require('../middleware/validators');

router.get('', POIController.listPOIs);
router.get('/:id', validate(poiValidators.getPOI), POIController.getPOI);
router.post('', validate(poiValidators.createPOI), POIController.createPOI);
router.put('/:id', validate(poiValidators.updatePOI), POIController.updatePOI);
router.delete('/:id', validate(poiValidators.deletePOI), POIController.deletePOI);

module.exports = router;