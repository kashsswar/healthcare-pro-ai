const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// Get admin boost for a doctor
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    console.log('Getting admin boost for doctor:', req.params.doctorId);
    
    const doctor = await Doctor.findOne({ userId: req.params.doctorId });
    if (!doctor) {
      console.log('Doctor not found, returning 0 boost');
      return res.json({ adminBoostRating: 0, boostAmount: 0 });
    }
    
    const boost = doctor.adminBoostRating || 0;
    console.log('Admin boost found:', boost);
    
    res.json({ 
      adminBoostRating: boost,
      boostAmount: boost
    });
  } catch (error) {
    console.error('Admin boost error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Set admin boost for a doctor
router.post('/doctor/:doctorId', async (req, res) => {
  try {
    const { boostAmount } = req.body;
    
    let doctor = await Doctor.findOne({ userId: req.params.doctorId });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    doctor.adminBoostRating = boostAmount || 0;
    await doctor.save();
    
    res.json({ 
      message: 'Admin boost updated successfully',
      adminBoostRating: doctor.adminBoostRating
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;