const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  permissions: [{
    type: String,
    enum: ['manage_doctors', 'boost_ratings', 'manage_content', 'view_analytics'],
    default: ['manage_doctors', 'boost_ratings']
  }],
  doctorBoosts: [{
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    boostType: { type: String, enum: ['rating', 'visibility', 'featured'] },
    boostValue: Number,
    reason: String,
    createdAt: { type: Date, default: Date.now },
    expiresAt: Date
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);