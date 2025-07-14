const express = require('express');
const ViralMarketingAI = require('../utils/viralMarketingAI');
const Incentive = require('../models/Incentive');
const Doctor = require('../models/Doctor');
const router = express.Router();

// Generate viral content
router.post('/generate-content', async (req, res) => {
  try {
    const { userId, doctorId, contentType } = req.body;
    const doctor = await Doctor.findById(doctorId).populate('userId');
    const user = { type: req.body.userType };
    
    const content = await ViralMarketingAI.generatePersonalizedContent(user, doctor, contentType);
    const campaigns = await ViralMarketingAI.generateViralCampaign(doctorId);
    
    res.json({ content, campaigns });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Track referral and calculate earnings
router.post('/track-referral', async (req, res) => {
  try {
    const { referrerId, referredId, userType } = req.body;
    
    const incentive = await ViralMarketingAI.calculateIncentives(referrerId, 'referral', {
      referredId, userType
    });
    
    res.json({ 
      message: 'Referral tracked successfully',
      earnings: incentive.earnings,
      bonus: userType === 'doctor' ? 500 : 100
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get earnings dashboard
router.get('/earnings/:userId', async (req, res) => {
  try {
    const incentive = await Incentive.findOne({ userId: req.params.userId });
    if (!incentive) {
      return res.json({ earnings: { totalEarned: 0, referralBonus: 0, shareBonus: 0, reviewBonus: 0 } });
    }
    
    const projectedMonthly = incentive.referrals.length * (incentive.type === 'doctor' ? 500 : 100);
    
    res.json({
      earnings: incentive.earnings,
      projectedMonthly,
      referralCount: incentive.referrals.length,
      shareCount: incentive.socialShares.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;