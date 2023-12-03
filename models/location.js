const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    buildingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Building',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    floor: Number,
    roomNumber: String
});

locationSchema.virtual('building', {
    ref: 'Building',
    localField: 'buildingId',
    foreignField: '_id',
    justOne: true
  });
  
  locationSchema.set('toObject', { virtuals: true });
  locationSchema.set('toJSON', { virtuals: true });
  

const Location = mongoose.model('Location', locationSchema);
module.exports = Location;
