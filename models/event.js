const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
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
    startDateTime: {
        type: Date,
        required: true
    },
    endDateTime: {
        type: Date,
        required: true
    },
    location: {
        locationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Location'
        },
    }
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
