const express = require('express');
const Appointment = require('../models/Appointment');
const AIService = require('../utils/aiService');
const SchedulingService = require('../utils/schedulingService');
const router = express.Router();

// Book appointment with AI pre-assessment
router.post('/book', async (req, res) => {
  try {
    const { patientId, doctorId, preferredDate, symptoms, patientHistory } = req.body;
    
    // AI analysis of symptoms
    const aiAssessment = await AIService.analyzeSymptoms(symptoms, patientHistory);
    
    // Find optimal time slot
    const preferredDateTime = new Date(preferredDate);
    const optimalSlot = await SchedulingService.findOptimalSlot(
      doctorId, 
      preferredDateTime, 
      aiAssessment.suggestedDuration
    );

    if (!optimalSlot) {
      return res.status(400).json({ 
        message: 'No available slots for the preferred date',
        suggestedDates: [] // Could implement alternative date suggestions
      });
    }

    const appointment = new Appointment({
      patient: patientId,
      doctor: doctorId,
      scheduledTime: optimalSlot,
      estimatedEndTime: new Date(optimalSlot.getTime() + aiAssessment.suggestedDuration * 60000),
      symptoms,
      aiPreAssessment: aiAssessment
    });

    await appointment.save();
    await SchedulingService.updateQueue(doctorId);

    // Notify via socket
    const io = req.app.get('io');
    io.emit('new-appointment', { appointmentId: appointment._id, doctorId });

    res.status(201).json({
      appointment,
      message: 'Appointment booked successfully',
      aiInsights: aiAssessment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get patient appointments
router.get('/patient/:patientId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.params.patientId })
      .populate('doctor')
      .populate({
        path: 'doctor',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .sort({ scheduledTime: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get doctor appointments with queue
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.params.doctorId })
      .populate('patient', 'name email phone profile')
      .sort({ scheduledTime: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start consultation
router.patch('/:id/start', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = 'in-progress';
    appointment.actualStartTime = new Date();
    await appointment.save();

    // Update queue
    await SchedulingService.updateQueue(appointment.doctor);

    // Notify patients in queue
    const io = req.app.get('io');
    io.to(`appointment-${appointment._id}`).emit('consultation-started');

    res.json({ message: 'Consultation started', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Complete consultation
router.patch('/:id/complete', async (req, res) => {
  try {
    const { diagnosis, prescription, notes, followUpRequired, followUpDate } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const actualEndTime = new Date();
    const actualDuration = Math.round(
      (actualEndTime - appointment.actualStartTime) / (1000 * 60)
    );

    appointment.status = 'completed';
    appointment.actualEndTime = actualEndTime;
    appointment.consultation = {
      diagnosis,
      prescription,
      notes,
      followUpRequired,
      followUpDate
    };
    await appointment.save();

    // Update doctor stats
    await SchedulingService.updateDoctorStats(appointment.doctor, actualDuration);
    
    // Handle any delays
    const scheduledDuration = appointment.aiPreAssessment?.suggestedDuration || 30;
    if (actualDuration > scheduledDuration) {
      await SchedulingService.handleAppointmentDelay(
        appointment._id, 
        actualDuration - scheduledDuration
      );
    }

    res.json({ message: 'Consultation completed', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get queue status
router.get('/queue/:doctorId', async (req, res) => {
  try {
    const queue = await SchedulingService.updateQueue(req.params.doctorId);
    res.json(queue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;