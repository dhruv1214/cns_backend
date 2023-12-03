
const { body, param, validationResult } = require('express-validator');

const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({ errors: errors.array() });
    };
};

const announcementValidators = {
    getAnnouncement: [
        param('id').isMongoId().withMessage('Invalid announcement ID format')
    ],
    createAnnouncement: [
        body('name').notEmpty().withMessage('Name is required'),
        body('description').optional().isString().withMessage('Description must be a string'),
        body('date').optional().isDate().withMessage('Date must be a date'),
    ],
    updateAnnouncement: [
        param('id').isMongoId().withMessage('Invalid announcement ID format'),
        body('name').optional().notEmpty().withMessage('Title cannot be empty'),
        body('description').optional().isString().withMessage('Description must be a string'),
        body('date').optional().isDate().withMessage('Date must be a date'),
    ],
    deleteAnnouncement: [
        param('id').isMongoId().withMessage('Invalid announcement ID format')
    ],
};

const buildingValidators = {
    getBuilding: [
        // c8eeb898-0286-42da-8fa4-5fc69fb2389d
        param('id')
        .notEmpty().withMessage('Building ID is required')
        .matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/).withMessage('Invalid building ID format'),
    ],
    createBuilding: [
        body('name').notEmpty().withMessage('Building name is required'),
        body('location').optional().isObject().withMessage('Location must be an object'),
        body('description').optional().isString().withMessage('Description must be a string'),
    ],
    updateBuilding: [
        param('id').notEmpty().withMessage('Building ID is required').matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/).withMessage('Invalid building ID format'),
        body('name').optional().notEmpty().withMessage('Building name cannot be empty'),
        body('location').optional().isObject().withMessage('Location must be an object'),
        body('description').optional().isString().withMessage('Description must be a string'),
    ],
    deleteBuilding: [
        param('id').notEmpty().withMessage('Building ID is required').matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/).withMessage('Invalid building ID format')
    ],
};

const eventValidators = {
    getEvent: [
        param('id').notEmpty().withMessage('Event ID is required').matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/).withMessage('Invalid event ID format')
    ],
    createEvent: [
        body('name').notEmpty().withMessage('Name is required'),
        body('description').optional().isString().withMessage('Description must be a string'),
        body('locationId').notEmpty().withMessage('Location ID is required').matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/).withMessage('Invalid location ID format'),
    ],
    updateEvent: [
        body('name').optional().notEmpty().withMessage('Name cannot be empty'),
        body('description').optional().isString().withMessage('Description must be a string'),
    ],
    deleteEvent: [
        param('id').notEmpty().withMessage('Event ID is required').matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/).withMessage('Invalid event ID format')
    ],
}

const locationValidators = {
    getLocation: [
        param('id').notEmpty().withMessage('Location ID is required').matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/).withMessage('Invalid location ID format')
    ],
    getLocationByBuildingId: [
        param('id').notEmpty().withMessage('Building ID is required').matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/).withMessage('Invalid building ID format')
    ],
    createLocation: [
        body('buildingId').notEmpty().withMessage('Building is required').matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/).withMessage('Invalid building ID format'),
        body('name').notEmpty().withMessage('Location name is required'),
        body('description').optional().isString().withMessage('Description must be a string'),
        body('floor').notEmpty().withMessage('Floor is required').isNumeric().withMessage('Floor must be a number'),
        body('roomNumber').optional().isString().withMessage('Room number must be a string'),
    ],
    updateLocation: [
        param('id').notEmpty().withMessage('Location ID is required').matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/).withMessage('Invalid location ID format'),
        body('buildingId').optional().notEmpty().withMessage('Building is required').matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/).withMessage('Invalid building ID format'),
        body('name').optional().notEmpty().withMessage('Location name cannot be empty'),
        body('description').optional().isString().withMessage('Description must be a string'),
        body('floor').optional().notEmpty().withMessage('Floor is required').isNumeric().withMessage('Floor must be a number'),
        body('roomNumber').optional().isString().withMessage('Room number must be a string'),
    ],
    deleteLocation: [
        param('id').notEmpty().withMessage('Location ID is required').matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/).withMessage('Invalid location ID format')
    ],
    getDistanceAndPathBetweenLocations: [
        param('start').notEmpty().withMessage('Start location ID is required').matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/).withMessage('Invalid Start location ID format'),
        param('end').notEmpty().withMessage('End location ID is required').matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/).withMessage('Invalid End location ID format'),
    ],
};

// (poi:PointOfInterest {poiId: randomUUID(), name: $name, description: $description, location: $location, category: $category})
const poiValidators = {
    getPoi: [
        param('id').notEmpty().withMessage('POI ID is required').matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/).withMessage('Invalid POI ID format')
    ],
    createPoi: [
        body('name').notEmpty().withMessage('POI name is required'),
        body('description').optional().isString().withMessage('Description must be a string'),
        body('locationId').notEmpty().withMessage('Location ID is required').matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/).withMessage('Invalid location ID format'),
        body('path').optional().isObject().withMessage('Path must be an object'),
    ],
    updatePoi: [
        param('id').notEmpty().withMessage('POI ID is required').matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/).withMessage('Invalid POI ID format'),
        body('name').optional().notEmpty().withMessage('POI name cannot be empty'),
        body('description').optional().isString().withMessage('Description must be a string'),
        body('locationId').optional().notEmpty().withMessage('Location ID is required').matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/).withMessage('Invalid location ID format'),
        body('path').optional().isObject().withMessage('Path must be an object'),
    ],
    deletePoi: [
        param('id').notEmpty().withMessage('POI ID is required').matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/).withMessage('Invalid POI ID format')
    ],
};

module.exports = {
    validate,
    announcementValidators,
    buildingValidators,
    eventValidators,
    locationValidators,
    poiValidators,
};