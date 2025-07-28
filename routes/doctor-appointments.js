const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Get appointments for a doctor
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ 
      doctorId: req.params.doctorId 
    })
    .populate('patientId', 'name email phone')
    .sort({ scheduledTime: -1 });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get today's appointments for a doctor
router.get('/doctor/:doctorId/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const appointments = await Appointment.find({ 
      doctorId: req.params.doctorId,
      scheduledTime: { $gte: today, $lt: tomorrow }
    })
    .populate('patientId', 'name email phone')
    .sort({ scheduledTime: 1 });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;