const mongoose = require('mongoose');

const incentiveSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['doctor', 'patient'], required: true },
  earnings: {
    referralBonus: { type: Number, default: 0 },
    shareBonus: { type: Number, default: 0 },
    reviewBonus: { type: Number, default: 0 },
    totalEarned: { type: Number, default: 0 }
  },
  referrals: [{
    referredUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    bonus: Number,
    status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
  }],
  socialShares: [{
    platform: String,
    reach: Number,
    conversions: Number,
    bonus: Number,
    createdAt: { type: Date, default: Date.now }
  }],
  payoutHistory: [{
    amount: Number,
    method: String,
    status: String,
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Incentive', incentiveSchema);