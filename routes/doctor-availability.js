const express = require('express');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const router = express.Router();

// Get doctor availability status
router.get('/:doctorId/availability-status', async (req, res) => {
  try {
    const { doctorId } = req.params;
    
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    // Count waiting patients
    const waitingPatients = await Appointment.countDocuments({
      doctor: doctorId,
      status: 'scheduled',
      scheduledTime: { $gte: new Date() }
    });
    
    res.json({
      isAvailable: doctor.isAvailable !== false, // Default to true
      status: doctor.isAvailable !== false ? 'Available' : 'Unavailable',
      waitingPatients,
      lastUpdated: doctor.availabilityUpdatedAt || new Date()
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle doctor availability
router.post('/:doctorId/toggle-availability', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { isAvailable } = req.body;
    
    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { 
        isAvailable,
        availabilityUpdatedAt: new Date()
      },
      { new: true }
    );
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    // Notify via socket if available
    const io = req.app.get('io');
    if (io) {
      io.emit('doctor-availability-changed', {
        doctorId,
        isAvailable,
        doctorName: doctor.userId?.name,
        timestamp: new Date()
      });
    }
    
    res.json({
      success: true,
      message: `Availability updated to ${isAvailable ? 'Available' : 'Unavailable'}`,
      isAvailable,
      updatedAt: doctor.availabilityUpdatedAt
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all available doctors (for patients)
router.get('/available-doctors', async (req, res) => {
  try {
    const availableDoctors = await Doctor.find({ 
      isAvailable: { $ne: false } // Not false (includes true and undefined)
    })
    .populate('userId', 'name email phone')
    .sort({ availabilityUpdatedAt: -1 });
    
    // Add real-time status
    const doctorsWithStatus = availableDoctors.map(doctor => ({
      ...doctor.toObject(),
      liveStatus: 'Available',
      lastSeen: doctor.availabilityUpdatedAt || new Date()
    }));
    
    res.json(doctorsWithStatus);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;