const express = require('express');
const AIMarketingService = require('../utils/aiMarketingService');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const router = express.Router();

// Generate social media content
router.post('/generate-content', async (req, res) => {
  try {
    const { specialization, targetAudience } = req.body;
    const content = await AIMarketingService.generateHealthContent(specialization, targetAudience);
    
    res.json({
      success: true,
      content,
      platform: 'social_media',
      specialization
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate WhatsApp marketing messages
router.post('/generate-whatsapp', async (req, res) => {
  try {
    const { doctorId } = req.body;
    const doctor = await Doctor.findById(doctorId).populate('userId');
    
    const message = await AIMarketingService.generateWhatsAppMessage(
      doctor.userId.name,
      doctor.specialization,
      doctor.location.city
    );
    
    res.json({
      success: true,
      message,
      doctor: doctor.userId.name,
      specialization: doctor.specialization
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate blog content
router.post('/generate-blog', async (req, res) => {
  try {
    const { topic, keywords } = req.body;
    const content = await AIMarketingService.generateBlogContent(topic, keywords);
    
    res.json({
      success: true,
      content,
      topic,
      keywords
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate email campaigns
router.post('/generate-email', async (req, res) => {
  try {
    const { campaignType, targetAudience } = req.body;
    const campaign = await AIMarketingService.generateEmailCampaign(campaignType, targetAudience);
    
    res.json({
      success: true,
      campaign,
      type: campaignType,
      audience: targetAudience
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Auto-generate marketing campaigns for all doctors
router.post('/auto-campaign', async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('userId');
    const patients = await User.find({ role: 'patient' });
    
    const campaigns = await AIMarketingService.scheduleMarketingCampaign(doctors, patients);
    
    res.json({
      success: true,
      message: `Generated ${campaigns.length} marketing campaigns`,
      campaigns: campaigns.map(c => ({
        doctor: c.doctorId,
        specialization: c.specialization,
        scheduledFor: c.scheduledFor
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate local marketing content
router.post('/generate-local', async (req, res) => {
  try {
    const { city, healthIssue } = req.body;
    const content = await AIMarketingService.generateLocalContent(city, healthIssue);
    
    res.json({
      success: true,
      content,
      city,
      healthIssue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get marketing analytics
router.get('/analytics', async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments();
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const specializations = await Doctor.distinct('specialization');
    
    res.json({
      success: true,
      analytics: {
        totalDoctors,
        totalPatients,
        specializations: specializations.length,
        marketingPotential: totalDoctors * 7, // 7 campaigns per doctor per week
        estimatedReach: totalPatients * 3 // Estimated social reach multiplier
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;