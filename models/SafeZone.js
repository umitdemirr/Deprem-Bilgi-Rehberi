const mongoose = require('mongoose');

const safeZoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  uniqueId: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  district: {
    type: String,
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
  capacity: {
    type: Number,
    required: true
  },
  source: {
    type: String,
    enum: ['AFAD', 'municipality', 'community', 'OpenStreetMap'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  facilities: [{
    type: String
  }],
  contactInfo: {
    phone: String,
    email: String
  }
}, {
  timestamps: true
});

// Sadece gerekli indexleri tanımla
safeZoneSchema.index({ location: '2dsphere' });
safeZoneSchema.index({ uniqueId: 1 }, { unique: true }); // Sadece uniqueId unique olsun
safeZoneSchema.index({ city: 1 }); // Performans için normal index
safeZoneSchema.index({ district: 1 }); // Performans için normal index

// Model caching pattern
module.exports = mongoose.models.Safe_Zone || mongoose.model('Safe_Zone', safeZoneSchema); 