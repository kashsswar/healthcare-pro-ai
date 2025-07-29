const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Book appointment
router.post('/', async (req, res) => {
  console.log('=== BOOK APPOINTMENT ROUTE HIT ===');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    console.log('Creating appointment object...');
    console.log('MongoDB connection state:', require('mongoose').connection.readyState);
    
    const appointmentData = {
      patient: req.body.patientId, // Use patientId as ObjectId reference
      doctorId: req.body.doctorId,
      scheduledTime: req.body.scheduledTime,
      symptoms: req.body.symptoms || [],
      consultationFee: req.body.consultationFee,
      doctor: req.body.doctor, // Keep doctor object as embedded document
      status: 'scheduled'
    };
    
    console.log('Appointment data to save:', JSON.stringify(appointmentData, null, 2));
    
    const appointment = new Appointment(appointmentData);
    console.log('Appointment object created successfully');
    
    console.log('Validating appointment...');
    const validationError = appointment.validateSync();
    if (validationError) {
      console.error('Validation error:', validationError);
      throw validationError;
    }
    
    console.log('Saving to database...');
    const savedAppointment = await appointment.save();
    console.log('Appointment saved successfully with ID:', savedAppointment._id);
    res.status(201).json(savedAppointment);
  } catch (error) {
    console.error('=== BOOK APPOINTMENT ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Request body:', JSON.stringify(req.body, null, 2));
    res.status(500).json({ message: error.message, error: error.toString() });
  }
});

module.exports = router;