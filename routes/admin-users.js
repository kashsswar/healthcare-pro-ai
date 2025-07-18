const express = require('express');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const router = express.Router();

// Get all users (doctors and patients)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    const doctors = await Doctor.find({}).populate('userId', 'name email phone');
    
    res.json({
      patients: users.filter(u => u.userType === 'patient'),
      doctors: doctors,
      totalUsers: users.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete doctor profile
router.delete('/doctor/:id', async (req, res) => {
  try {
    const doctorId = req.params.id;
    
    // Find doctor and user
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    // Delete related appointments
    await Appointment.deleteMany({ doctor: doctorId });
    
    // Delete doctor profile
    await Doctor.findByIdAndDelete(doctorId);
    
    // Delete user account
    await User.findByIdAndDelete(doctor.userId);
    
    res.json({ message: 'Doctor profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete patient profile
router.delete('/patient/:id', async (req, res) => {
  try {
    const patientId = req.params.id;
    
    // Delete related appointments
    await Appointment.deleteMany({ patient: patientId });
    
    // Delete user account
    const deleted = await User.findByIdAndDelete(patientId);
    if (!deleted) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.json({ message: 'Patient profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;