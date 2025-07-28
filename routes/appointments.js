const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Create appointment
router.post('/', async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId', 'name email phone')
      .populate('doctorId', 'name')
      .sort({ scheduledTime: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get appointments for a doctor
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.params.doctorId })
      .populate('patient', 'name email phone profile')
      .sort({ scheduledTime: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get appointments for a patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.patientId })
      .populate('doctorId', 'name specialization')
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

// Get doctor stats
router.get('/doctor/:doctorId/stats', async (req, res) => {
  try {
    const totalAppointments = await Appointment.countDocuments({ doctorId: req.params.doctorId });
    const completedAppointments = await Appointment.countDocuments({ 
      doctorId: req.params.doctorId, 
      status: 'completed' 
    });
    
    res.json({
      totalAppointments,
      completedAppointments,
      pendingAppointments: totalAppointments - completedAppointments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fix null doctorIds
router.post('/fix-doctor-ids', async (req, res) => {
  try {
    const result = await Appointment.updateMany(
      { doctorId: null },
      { $set: { doctorId: '68833140c62b0feec7a55a6b' } }
    );
    res.json({ message: 'Fixed doctor IDs', modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fix patient field references
router.post('/fix-patient-refs', async (req, res) => {
  try {
    const result = await Appointment.updateMany(
      { patientId: { $exists: false }, patient: { $type: 'string' } },
      [{ $set: { patientId: { $toObjectId: '$patient' } } }]
    );
    res.json({ message: 'Fixed patient references', modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Debug appointment structure
router.get('/debug-structure', async (req, res) => {
  try {
    const appointment = await Appointment.findOne().limit(1);
    res.json({ 
      appointment,
      hasPatientId: !!appointment?.patientId,
      patientIdType: typeof appointment?.patientId,
      hasPatient: !!appointment?.patient,
      patientType: typeof appointment?.patient
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Convert patient strings to ObjectIds
router.post('/convert-patient-ids', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const appointments = await Appointment.find({ patient: { $type: 'string' } });
    let updated = 0;
    
    for (const apt of appointments) {
      if (mongoose.Types.ObjectId.isValid(apt.patient)) {
        await Appointment.updateOne(
          { _id: apt._id },
          { $set: { patient: new mongoose.Types.ObjectId(apt.patient) } }
        );
        updated++;
      }
    }
    
    res.json({ message: 'Converted patient IDs', modifiedCount: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;