const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get patient profile
router.get('/:patientId', async (req, res) => {
  try {
    console.log('Getting patient profile for:', req.params.patientId);
    const user = await User.findById(req.params.patientId);
    if (!user) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    const profileData = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      profile: user.profile || {
        age: '',
        gender: '',
        city: '',
        state: '',
        medicalHistory: []
      }
    };
    
    console.log('Patient profile:', profileData);
    res.json(profileData);
  } catch (error) {
    console.error('Error getting patient profile:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update patient profile
router.put('/:patientId', async (req, res) => {
  try {
    const { name, phone, age, gender, city, state, medicalHistory } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.patientId,
      {
        name,
        phone,
        profile: {
          age,
          gender,
          city,
          state,
          medicalHistory: medicalHistory ? medicalHistory.split(',').map(h => h.trim()) : []
        }
      },
      { new: true }
    );
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;