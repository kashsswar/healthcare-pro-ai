const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Book appointment
router.post('/', async (req, res) => {
  console.log('=== BOOK APPOINTMENT ROUTE HIT ===');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    console.log('Creating appointment object...');
    const appointment = new Appointment({
      patientId: req.body.patientId,
      doctorId: req.body.doctorId,
      scheduledTime: req.body.scheduledTime,
      symptoms: req.body.symptoms || [],
      consultationFee: req.body.consultationFee,
      patient: req.body.patient,
      doctor: req.body.doctor,
      status: 'scheduled'
    });
    
    console.log('Appointment object created:', appointment);
    console.log('Saving to database...');
    await appointment.save();
    console.log('Appointment saved successfully!');
    res.status(201).json(appointment);
  } catch (error) {
    console.error('=== BOOK APPOINTMENT ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Request body:', JSON.stringify(req.body, null, 2));
    res.status(500).json({ message: error.message, error: error.toString() });
  }
});

module.exports = router;