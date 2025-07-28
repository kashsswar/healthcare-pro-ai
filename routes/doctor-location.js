const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// Get doctor location
router.get('/:doctorId', async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.params.doctorId });
    if (!doctor) {
      return res.json({ location: { city: '', state: '', address: '' } });
    }
    
    res.json({ 
      location: doctor.location || { city: '', state: '', address: '' }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update doctor location
router.put('/:doctorId', async (req, res) => {
  try {
    const { city, state, address } = req.body;
    
    let doctor = await Doctor.findOne({ userId: req.params.doctorId });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    doctor.location = {
      city: city || '',
      state: state || '',
      address: address || ''
    };
    
    await doctor.save();
    
    res.json({ 
      message: 'Location updated successfully',
      location: doctor.location
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;