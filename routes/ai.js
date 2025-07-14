const express = require('express');
const AIService = require('../utils/aiService');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const router = express.Router();

// AI Health Recommendations
router.post('/health-recommendations', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const consultationHistory = await Appointment.find({ 
      patient: userId, 
      status: 'completed' 
    }).limit(5).sort({ createdAt: -1 });

    const recommendations = await AIService.generateHealthRecommendations(
      user.profile, 
      consultationHistory
    );

    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Symptom Analysis
router.post('/analyze-symptoms', async (req, res) => {
  try {
    const { symptoms, patientHistory = [] } = req.body;
    
    const analysis = await AIService.analyzeSymptoms(symptoms, patientHistory);
    
    res.json({
      analysis,
      message: 'Symptom analysis completed. Please consult with a doctor for proper diagnosis.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Smart Doctor Matching
router.post('/match-doctor', async (req, res) => {
  try {
    const { symptoms, location, preferences = {} } = req.body;
    
    const match = await AIService.matchDoctor(symptoms, location, preferences);
    
    res.json({ match });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Predict consultation duration
router.post('/predict-duration', async (req, res) => {
  try {
    const { symptoms, doctorId, patientHistory = [] } = req.body;
    
    // Get doctor's average time (would fetch from database)
    const doctorAvgTime = 30; // Default, should fetch from Doctor model
    
    const predictedDuration = AIService.predictConsultationDuration(
      symptoms, 
      doctorAvgTime, 
      patientHistory
    );
    
    res.json({ predictedDuration });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;