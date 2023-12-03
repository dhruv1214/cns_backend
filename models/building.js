const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        coordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere' // Create a geospatial index
        }
    },
    imageURL: {
        type: String,
        trim: true
    }
});

const Building = mongoose.model('Building', buildingSchema);
module.exports = Building;
