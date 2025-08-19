const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Test route
router.get('/test-book', (req, res) => {
  console.log('Test book route hit');
  res.json({ message: 'Book appointment route is working', timestamp: new Date() });
});

// Create appointment
router.post('/', async (req, res) => {
  try {
    console.log('=== CREATING NEW APPOINTMENT ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const appointment = new Appointment(req.body);
    const savedAppointment = await appointment.save();
    
    console.log('Appointment saved successfully:', {
      id: savedAppointment._id,
      patientId: savedAppointment.patientId,
      doctorId: savedAppointment.doctorId,
      scheduledTime: savedAppointment.scheduledTime,
      createdAt: savedAppointment.createdAt
    });
    
    res.status(201).json(savedAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: error.message });
  }
});

// Book appointment (alternative endpoint)
router.post('/book-appointment', async (req, res) => {
  console.log('=== BOOK APPOINTMENT ROUTE HIT ===');
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  console.log('Request headers:', req.headers);
  
  try {
    console.log('Creating new appointment...');
    const appointment = new Appointment(req.body);
    console.log('Appointment object created, saving...');
    const savedAppointment = await appointment.save();
    console.log('Appointment saved successfully:', savedAppointment._id);
    res.status(201).json(savedAppointment);
  } catch (error) {
    console.error('=== BOOK APPOINTMENT ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Request body that caused error:', JSON.stringify(req.body, null, 2));
    res.status(500).json({ message: error.message, error: error.toString() });
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
    const appointments = await Appointment.find({ 
      $or: [
        { patientId: req.params.patientId },
        { patient: req.params.patientId }
      ]
    })
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

// Update appointment (including cancel)
router.put('/:appointmentId', async (req, res) => {
  try {
    console.log('Updating appointment:', req.params.appointmentId, 'with data:', req.body);
    
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.appointmentId,
      req.body,
      { new: true }
    );
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    console.log('Appointment updated successfully:', appointment._id);
    res.json({ message: 'Appointment updated successfully', appointment });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Cancel appointment
router.put('/:appointmentId/cancel', async (req, res) => {
  try {
    console.log('Cancelling appointment:', req.params.appointmentId);
    
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.appointmentId,
      { 
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelledBy: req.body.cancelledBy || 'patient'
      },
      { new: true }
    );
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Add refund to patient wallet
    const mongoose = require('mongoose');
    const Wallet = mongoose.model('PatientWallet');
    const refundAmount = appointment.consultationFee || 500;
    
    let wallet = await Wallet.findOne({ userId: appointment.patientId || appointment.patient });
    if (!wallet) {
      wallet = new Wallet({ userId: appointment.patientId || appointment.patient, balance: 0 });
    }
    
    wallet.balance += refundAmount;
    wallet.transactions.push({
      type: 'credit',
      amount: refundAmount,
      description: 'Appointment cancellation refund',
      transactionId: `REF_${appointment._id}`,
      timestamp: new Date()
    });
    
    await wallet.save();
    
    console.log('Appointment cancelled and refund added:', appointment._id);
    res.json({ 
      message: 'Appointment cancelled successfully. Refund added to wallet.', 
      appointment,
      refundAmount 
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;