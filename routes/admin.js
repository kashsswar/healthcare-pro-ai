const express = require('express');
const Doctor = require('../models/Doctor');
const Admin = require('../models/Admin');
const User = require('../models/User');
const MarketingTracker = require('../models/MarketingTracker');
const router = express.Router();

// Admin boost doctor rating (veto power)
router.post('/boost-doctor', async (req, res) => {
  try {
    const { doctorId, boostType, boostValue, reason, adminId } = req.body;
    
    // Verify admin permissions
    const admin = await Admin.findOne({ userId: adminId, isActive: true });
    if (!admin || !admin.permissions.includes('boost_ratings')) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Apply boost based on type
    switch (boostType) {
      case 'rating':
        doctor.adminBoostRating = boostValue;
        doctor.finalRating = Math.min(5, doctor.rating + doctor.adminBoostRating);
        break;
      case 'visibility':
        doctor.visibilityBoost = boostValue;
        break;
      case 'featured':
        doctor.isFeatured = true;
        break;
    }

    await doctor.save();

    // Log the boost
    admin.doctorBoosts.push({
      doctorId,
      boostType,
      boostValue,
      reason,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });
    await admin.save();

    res.json({ message: 'Doctor boosted successfully', doctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      incentive: shareType === 'referral' ? '🎁 Get ₹50 discount on your next appointment!' : null
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
      whatsapp_doctors: "🏥 *DOCTORS: EARN ₹500 per referral!*\n\n💰 *Monthly Earning Potential: ₹15,000+*\n\n✅ Refer 1 doctor = ₹500\n✅ Refer 1 patient = ₹100\n✅ Instant bank transfer",
      linkedin_doctors: "💰 Healthcare professionals earning ₹15,000+ monthly!\n\n🎯 Join HealthcarePro:\n• ₹500 per doctor referral\n• ₹100 per patient referral\n• AI-powered patient matching",
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