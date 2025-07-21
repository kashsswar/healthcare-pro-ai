const express = require('express');
const Appointment = require('../models/Appointment');
const router = express.Router();

// Confirm appointment
router.patch('/:id/confirm', async (req, res) => {
  try {
    const appointmentId = req.params.id;
    
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { 
        status: 'confirmed',
        confirmedAt: new Date()
      },
      { new: true }
    ).populate('patient', 'name email phone profile')
     .populate('doctor');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Notify patient via socket
    const io = req.app.get('io');
    if (io) {
      io.emit('appointment-confirmed', {
        appointmentId,
        patientId: appointment.patient._id,
        doctorName: appointment.doctor?.userId?.name || 'Doctor',
        scheduledTime: appointment.scheduledTime,
        message: 'Your appointment has been confirmed by the doctor'
      });
    }
    
    res.json({
      success: true,
      message: 'Appointment confirmed successfully',
      appointment
    });
    
  } catch (error) {
    console.error('Confirm appointment error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;