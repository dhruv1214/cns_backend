const mongoose = require("mongoose");

const poiSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    location: {
        coordinates: {
            type: [Number],
            index: '2dsphere'
        }
    },
    category: String
});

const PointOfInterest = mongoose.model('PointOfInterest', poiSchema);
module.exports = PointOfInterest;
