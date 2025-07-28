const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// Get doctor profile
router.get('/:doctorId', async (req, res) => {
  try {
    console.log('Getting doctor profile for:', req.params.doctorId);
    
    // First check if user exists
    const user = await User.findById(req.params.doctorId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const doctor = await Doctor.findOne({ userId: req.params.doctorId }).populate('userId');
    if (!doctor) {
      console.log('Doctor profile not found, creating default');
      // Return default structure for doctors without profile
      return res.json({
        userId: user,
        specialization: '',
        experience: 0,
        consultationFee: 0,
        qualification: [],
        location: { city: '', state: '' },
        rating: 4.5,
        adminBoostRating: 0
      });
    }
    
    console.log('Doctor found:', doctor);
    res.json(doctor);
  } catch (error) {
    console.error('Error getting doctor profile:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update doctor profile
router.put('/:doctorId', async (req, res) => {
  try {
    const { specialization, experience, consultationFee, qualification, flatNo, street, city, state, phone } = req.body;
    
    let doctor = await Doctor.findOne({ userId: req.params.doctorId });
    
    if (!doctor) {
      doctor = new Doctor({
        userId: req.params.doctorId,
        specialization,
        experience,
        consultationFee,
        qualification: qualification.split(',').map(q => q.trim()),
        location: { city, state, address: `${flatNo} ${street}, ${city}, ${state}` },
        isVerified: true
      });
    } else {
      doctor.specialization = specialization;
      doctor.experience = experience;
      doctor.consultationFee = consultationFee;
      doctor.qualification = qualification.split(',').map(q => q.trim());
      doctor.location = { city, state, address: `${flatNo} ${street}, ${city}, ${state}` };
    }
    
    await doctor.save();
    
    // Update user phone
    await User.findByIdAndUpdate(req.params.doctorId, { phone });
    
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get doctor categories with counts
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Doctor.aggregate([
      { $group: { _id: '$specialization', count: { $sum: 1 } } },
      { $match: { _id: { $ne: null } } }
    ]);
    
    const iconMap = {
      'General Medicine': '🏥',
      'Cardiology': '❤️',
      'Dermatology': '🧴',
      'Pediatrics': '👶',
      'Orthopedics': '🦴',
      'Gynecology': '👩‍⚕️',
      'Neurology': '🧠',
      'Psychiatry': '🧘',
      'Ophthalmology': '👁️',
      'ENT': '👂',
      'Dentistry': '🦷',
      'Urology': '🫘'
    };
    
    const result = categories.map(cat => ({
      id: cat._id.toLowerCase().replace(/\s+/g, '-'),
      name: cat._id,
      icon: iconMap[cat._id] || '🏥',
      count: cat.count
    }));
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;