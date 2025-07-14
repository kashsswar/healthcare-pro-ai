const mongoose = require('mongoose');

const marketingTrackerSchema = new mongoose.Schema({
  channel: { type: String, enum: ['whatsapp', 'linkedin', 'facebook', 'email', 'conference', 'referral'], required: true },
  content: String,
  targetAudience: { type: String, enum: ['doctors', 'patients'], required: true },
  reach: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  conversions: {
    doctors: { type: Number, default: 0 },
    patients: { type: Number, default: 0 }
  },
  campaignDate: { type: Date, default: Date.now },
  cost: { type: Number, default: 0 },
  roi: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('MarketingTracker', marketingTrackerSchema);