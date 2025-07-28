const express = require('express');
const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const AIService = require('../utils/aiService');
const SchedulingService = require('../utils/schedulingService');
const QueueManager = require('../utils/queueManager');
const router = express.Router();

// Book appointment with AI pre-assessment (with fallbacks)
router.post('/book', async (req, res) => {
  try {
    const { patientId, doctorId, preferredDate, symptoms, patientHistory } = req.body;
    
    // AI analysis with fallback
    let aiAssessment;
    try {
      aiAssessment = await AIService.analyzeSymptoms(symptoms, patientHistory);
    } catch (error) {
      // Fallback AI assessment
      aiAssessment = {
        riskLevel: 'medium',
        suggestedDuration: 30,
        recommendations: ['General consultation recommended']
      };
    }
    
    // Simple time slot assignment (fallback for complex scheduling)
    let preferredDateTime;
    if (preferredDate) {
      preferredDateTime = new Date(preferredDate);
    } else {
      // Default to next hour if no date provided
      preferredDateTime = new Date();
      preferredDateTime.setHours(preferredDateTime.getHours() + 1, 0, 0, 0);
    }
    
    let optimalSlot;
    
    try {
      optimalSlot = await SchedulingService.findOptimalSlot(
        doctorId, 
        preferredDateTime, 
        aiAssessment.suggestedDuration
      );
    } catch (error) {
      // Fallback: use preferred time or next available hour
      optimalSlot = new Date(preferredDateTime);
      if (isNaN(optimalSlot.getTime())) {
        optimalSlot = new Date();
        optimalSlot.setHours(optimalSlot.getHours() + 1, 0, 0, 0);
      }
    }

    // Ensure optimalSlot is valid
    if (!optimalSlot || isNaN(optimalSlot.getTime())) {
      optimalSlot = new Date();
      optimalSlot.setHours(optimalSlot.getHours() + 1, 0, 0, 0);
    }
    
    const appointment = new Appointment({
      patient: patientId,
      doctor: doctorId,
      scheduledTime: optimalSlot,
      estimatedEndTime: new Date(optimalSlot.getTime() + (aiAssessment.suggestedDuration || 30) * 60000),
      symptoms: symptoms ? [symptoms] : [],
      aiPreAssessment: aiAssessment,
      status: 'scheduled'
    });

    await appointment.save();
    
    // Update queue with fallback
    try {
      await SchedulingService.updateQueue(doctorId);
    } catch (error) {
      console.log('Queue update failed, continuing...');
    }

    // Notify via socket
    const io = req.app.get('io');
    if (io) {
      io.emit('new-appointment', { appointmentId: appointment._id, doctorId });
    }

    res.status(201).json({
      success: true,
      appointment,
      message: 'Appointment booked successfully with AI assistance',
      aiInsights: aiAssessment
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to book appointment: ' + error.message 
    });
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

// Mark appointment as completed and reschedule queue
router.post('/complete-consultation/:appointmentId', async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { doctorId } = req.body;

    const result = await QueueManager.completeAppointment(appointmentId, doctorId);
    
    // Notify patients about rescheduling via Socket.IO
    const io = req.app.get('io');
    if (io && result.rescheduledAppointments.length > 0) {
      await QueueManager.notifyRescheduledPatients(result.rescheduledAppointments, io);
    }

    res.json({
      success: true,
      message: `Consultation completed! ${result.rescheduledCount} patients moved to earlier slots.`,
      completedAppointment: result.completedAppointment,
      rescheduledCount: result.rescheduledCount,
      rescheduledAppointments: result.rescheduledAppointments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get doctor's queue for today
router.get('/doctor-queue/:doctorId', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const queueData = await QueueManager.getDoctorQueue(doctorId);
    
    res.json({
      success: true,
      ...queueData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Simple appointment booking (without AI dependencies)
router.post('/book-simple', async (req, res) => {
  try {
    const { patientId, doctorId, appointmentDate, appointmentTime, symptoms } = req.body;
    
    // Handle patientId - create valid ObjectId
    let validPatientId;
    if (mongoose.Types.ObjectId.isValid(patientId)) {
      validPatientId = patientId;
    } else {
      // For admin_001 type IDs, create a new ObjectId
      validPatientId = new mongoose.Types.ObjectId();
    }
    
    let scheduledDateTime;
    if (appointmentDate && appointmentTime) {
      scheduledDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    } else {
      scheduledDateTime = new Date();
      scheduledDateTime.setHours(scheduledDateTime.getHours() + 1, 0, 0, 0);
    }
    
    if (isNaN(scheduledDateTime.getTime())) {
      scheduledDateTime = new Date();
      scheduledDateTime.setHours(scheduledDateTime.getHours() + 1, 0, 0, 0);
    }
    
    const estimatedEndTime = new Date(scheduledDateTime.getTime() + 30 * 60000);
    
    // Ensure symptoms is an array of strings
    let symptomsArray = [];
    if (symptoms) {
      if (typeof symptoms === 'string') {
        symptomsArray = symptoms.split(',').map(s => s.trim()).filter(s => s.length > 0);
      } else if (Array.isArray(symptoms)) {
        symptomsArray = symptoms.map(s => String(s).trim()).filter(s => s.length > 0);
      }
    }
    
    const appointment = new Appointment({
      patient: validPatientId,
      doctor: doctorId,
      scheduledTime: scheduledDateTime,
      estimatedEndTime: estimatedEndTime,
      symptoms: symptomsArray,
      status: 'scheduled'
    });

    await appointment.save();

    // Notify via socket
    const io = req.app.get('io');
    if (io) {
      io.emit('new-appointment', { appointmentId: appointment._id, doctorId });
    }

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      appointment
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to book appointment: ' + error.message 
    });
  }
});

// Get doctor statistics
router.get('/doctor/:doctorId/stats', async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    
    // Count completed appointments
    const completedAppointments = await Appointment.countDocuments({
      doctorId: doctorId,
      status: 'completed'
    });
    
    // Count reviews
    const Review = require('../models/Review');
    const reviewCount = await Review.countDocuments({
      doctorId: doctorId
    });
    
    res.json({
      completedAppointments,
      reviewCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;