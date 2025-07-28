const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Book appointment
router.post('/', async (req, res) => {
  try {
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
    
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;