const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: { type: String, required: true },
  qualification: [String],
  experience: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  adminBoostRating: { type: Number, default: 0 },
  finalRating: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  visibilityBoost: { type: Number, default: 0 },
  consultationFee: { type: Number, required: true },
  availability: [{
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    startTime: String,
    endTime: String,
    isAvailable: { type: Boolean, default: true }
  }],
  avgConsultationTime: { type: Number, default: 30 }, // minutes
  location: {
    address: String,
    city: String,
    coordinates: { lat: Number, lng: Number }
  },
  isVerified: { type: Boolean, default: false },
  totalPatients: { type: Number, default: 0 },
  marketingReach: {
    whatsappShares: { type: Number, default: 0 },
    referrals: { type: Number, default: 0 },
    socialShares: { type: Number, default: 0 }
  },
  accessibilityFeatures: {
    largeText: { type: Boolean, default: false },
    highContrast: { type: Boolean, default: false },
    voiceSupport: { type: Boolean, default: false }
  }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);