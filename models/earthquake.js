const mongoose = require('mongoose');

const earthquakeSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    magnitude: {
        type: Number,
        required: true
    },
    depth: {
        type: Number,
        required: true
    },
    city: String,
    district: String,
    description: String
}, {
    timestamps: true
});

// Lokasyon bazlı sorgular için geospatial index
earthquakeSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Earthquake', earthquakeSchema); 