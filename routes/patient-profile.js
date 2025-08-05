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
        dateOfBirth: '',
        gender: '',
        flatNo: '',
        street: '',
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
    console.log('Updating patient profile with data:', req.body);
    const { name, phone, age, dateOfBirth, gender, flatNo, street, city, state, medicalHistory } = req.body;
    
    const profileData = {
      age: age || '',
      dateOfBirth: dateOfBirth || '',
      gender: gender || '',
      flatNo: flatNo || '',
      street: street || '',
      city: city || '',
      state: state || '',
      medicalHistory: medicalHistory ? (typeof medicalHistory === 'string' ? medicalHistory.split(',').map(h => h.trim()) : medicalHistory) : []
    };
    
    console.log('Profile data to save:', profileData);
    
    const user = await User.findByIdAndUpdate(
      req.params.patientId,
      {
        name,
        phone,
        profile: profileData
      },
      { new: true }
    );
    
    console.log('Updated user profile:', user.profile);
    res.json(user);
  } catch (error) {
    console.error('Error updating patient profile:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;