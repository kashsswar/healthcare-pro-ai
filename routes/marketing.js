const express = require('express');
const AIMarketingService = require('../utils/aiMarketingService');
const AutoPostingService = require('../utils/autoPostingService');
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

// Auto-post generated content to all platforms
router.post('/auto-post', async (req, res) => {
  try {
    const { specialization, targetAudience } = req.body;
    
    // Generate content using AI
    const content = await AIMarketingService.generateHealthContent(specialization, targetAudience);
    
    // Get all patients for targeting
    const patients = await User.find({ role: 'patient' }).limit(100); // Limit for testing
    
    // Post to all platforms
    const results = await AutoPostingService.postToAllPlatforms(content, patients);
    
    res.json({
      success: true,
      message: 'Content posted to all platforms',
      content,
      results: {
        emailsSent: results.email.filter(r => r.status === 'sent').length,
        whatsappSent: results.whatsapp.filter(r => r.success).length,
        facebookPosted: results.facebook.success,
        twitterPosted: results.twitter.success,
        smsSent: results.sms.filter(r => r.status === 'sent').length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send email campaign
router.post('/send-email', async (req, res) => {
  try {
    const { subject, content, targetAudience } = req.body;
    const patients = await User.find({ role: 'patient' });
    
    const results = await AutoPostingService.sendBulkEmails(patients, subject, content);
    
    res.json({
      success: true,
      message: `Email sent to ${results.filter(r => r.status === 'sent').length} patients`,
      results
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send WhatsApp campaign
router.post('/send-whatsapp', async (req, res) => {
  try {
    const { message } = req.body;
    const patients = await User.find({ role: 'patient', phone: { $exists: true } });
    
    const results = await AutoPostingService.sendBulkWhatsApp(patients, message);
    
    res.json({
      success: true,
      message: `WhatsApp sent to ${results.filter(r => r.success).length} patients`,
      results
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Post to social media
router.post('/post-social', async (req, res) => {
  try {
    const { content, platform } = req.body;
    let result;
    
    if (platform === 'facebook') {
      result = await AutoPostingService.postToFacebook(content);
    } else if (platform === 'twitter') {
      result = await AutoPostingService.postToTwitter(content);
    } else {
      // Post to all platforms
      const facebook = await AutoPostingService.postToFacebook(content);
      const twitter = await AutoPostingService.postToTwitter(content);
      result = { facebook, twitter };
    }
    
    res.json({
      success: true,
      message: 'Posted to social media',
      result
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Full automation - Generate + Post
router.post('/full-automation', async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('userId');
    const patients = await User.find({ role: 'patient' });
    const results = [];
    
    // Generate and post content for each specialization
    const specializations = [...new Set(doctors.map(d => d.specialization))];
    
    for (const specialization of specializations) {
      // Generate AI content
      const content = await AIMarketingService.generateHealthContent(specialization);
      
      // Post to all platforms
      const postResults = await AutoPostingService.postToAllPlatforms(content, patients);
      
      results.push({
        specialization,
        content: content.substring(0, 100) + '...',
        emailsSent: postResults.email.filter(r => r.status === 'sent').length,
        whatsappSent: postResults.whatsapp.filter(r => r.success).length,
        socialPosted: postResults.facebook.success && postResults.twitter.success
      });
      
      // Delay between campaigns
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    res.json({
      success: true,
      message: `Full automation completed for ${specializations.length} specializations`,
      results
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;