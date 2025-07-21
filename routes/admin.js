const express = require('express');
const Doctor = require('../models/Doctor');
const Admin = require('../models/Admin');
const User = require('../models/User');
const MarketingTracker = require('../models/MarketingTracker');
const router = express.Router();

// Admin boost doctor rating (veto power)
router.post('/boost-doctor', async (req, res) => {
  try {
    const { doctorId, boostType, boostValue, customRating, reason, adminId } = req.body;
    
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Apply boost based on type
    switch (boostType) {
      case 'rating':
        if (customRating && customRating >= 1.0 && customRating <= 5.0) {
          // Set exact rating
          doctor.adminBoostRating = customRating - (doctor.rating || 0);
          doctor.finalRating = customRating;
        } else {
          // Default boost
          doctor.adminBoostRating = (doctor.adminBoostRating || 0) + (boostValue || 0.5);
          doctor.finalRating = Math.min(5, (doctor.rating || 0) + doctor.adminBoostRating);
        }
        break;
      case 'visibility':
        doctor.visibilityBoost = boostValue;
        break;
      case 'featured':
        doctor.isFeatured = true;
        break;
    }

    await doctor.save();

    console.log(`Admin boosted doctor ${doctorId}: ${boostType} - Rating: ${doctor.finalRating}`);

    res.json({ 
      success: true,
      message: customRating ? `Rating set to ${customRating}` : 'Doctor boosted successfully', 
      doctor,
      newRating: doctor.finalRating
    });
  } catch (error) {
    console.error('Boost error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get marketing analytics
router.get('/marketing-stats', async (req, res) => {
  try {
    const doctors = await Doctor.find({}).populate('userId', 'name');
    
    const stats = doctors.map(doctor => ({
      name: doctor.userId.name,
      specialization: doctor.specialization,
      whatsappShares: doctor.marketingReach.whatsappShares,
      referrals: doctor.marketingReach.referrals,
      socialShares: doctor.marketingReach.socialShares,
      totalReach: doctor.marketingReach.whatsappShares + 
                  doctor.marketingReach.referrals + 
                  doctor.marketingReach.socialShares
    }));

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Viral marketing - share doctor profile
router.post('/share-doctor', async (req, res) => {
  try {
    const { doctorId, shareType, referrerPhone } = req.body;
    
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Increment share count
    switch (shareType) {
      case 'whatsapp':
        doctor.marketingReach.whatsappShares += 1;
        break;
      case 'referral':
        doctor.marketingReach.referrals += 1;
        break;
      case 'social':
        doctor.marketingReach.socialShares += 1;
        break;
    }

    await doctor.save();

    // Generate shareable content
    const shareContent = {
      message: `🏥 Found an excellent ${doctor.specialization} doctor!\n\n👨‍⚕️ Dr. ${doctor.userId.name}\n⭐ Rating: ${doctor.finalRating}/5\n💰 Fee: ₹${doctor.consultationFee}\n📱 Book online: [App Link]\n\n#HealthCare #Doctor #${doctor.specialization}`,
      whatsappLink: `https://wa.me/?text=${encodeURIComponent('🏥 Found an excellent doctor! Download HealthCare app to book appointment with Dr. ' + doctor.userId.name)}`,
      incentive: null
    };

    res.json({ shareContent, message: 'Share tracked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Marketing Analytics Dashboard
router.get('/marketing-analytics', async (req, res) => {
  try {
    const campaigns = await MarketingTracker.find().sort({ createdAt: -1 });
    
    const totalDoctors = await User.countDocuments({ userType: 'doctor' });
    const totalPatients = await User.countDocuments({ userType: 'patient' });
    
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newDoctors = await User.countDocuments({ userType: 'doctor', createdAt: { $gte: last30Days } });
    const newPatients = await User.countDocuments({ userType: 'patient', createdAt: { $gte: last30Days } });
    
    const channelStats = await MarketingTracker.aggregate([
      { $group: {
        _id: '$channel',
        totalReach: { $sum: '$reach' },
        totalClicks: { $sum: '$clicks' },
        doctorConversions: { $sum: '$conversions.doctors' },
        patientConversions: { $sum: '$conversions.patients' }
      }}
    ]);
    
    const marketingContent = {
      whatsapp_doctors: "🏥 *DOCTORS: Expand Your Practice Online*\n\n💼 *Join Healthcare Pro AI Platform*\n\n✅ Reach more patients digitally\n✅ Flexible online consultations\n✅ Professional growth opportunities",
      linkedin_doctors: "👨‍⚕️ Healthcare professionals expanding online!\n\n🎯 Join HealthcarePro:\n• Connect with more patients\n• AI-powered patient matching\n• Professional online presence",
      whatsapp_patients: "🏥 *Found the BEST healthcare app!*\n\n✅ AI finds perfect doctor for your symptoms\n✅ Book appointments in 30 seconds\n✅ Real-time queue updates",
      social_patients: "🏥 Revolutionary healthcare experience!\n\n✨ AI-powered doctor matching\n✨ Instant appointments\n✨ Real-time updates\n✨ Personalized health tips"
    };
    
    res.json({
      campaigns,
      stats: {
        totalDoctors,
        totalPatients,
        newDoctors,
        newPatients,
        channelStats
      },
      marketingContent,
      channels: [
        { name: 'WhatsApp Groups', target: 'Medical college groups, Hospital staff groups', reach: '10,000+ doctors' },
        { name: 'LinkedIn', target: 'Medical professionals, Healthcare workers', reach: '5,000+ professionals' },
        { name: 'Facebook', target: 'Healthcare groups, Medical pages', reach: '15,000+ users' },
        { name: 'Email Campaigns', target: 'Medical databases, Conference lists', reach: '8,000+ emails' },
        { name: 'Medical Conferences', target: 'Live demos, Booth presentations', reach: '2,000+ attendees' }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;