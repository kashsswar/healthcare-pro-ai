const express = require('express');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const AIService = require('../utils/aiService');
const SpecializationService = require('../utils/specializationService');
const router = express.Router();

// Get all available specializations
router.get('/specializations', async (req, res) => {
  try {
    const specializations = SpecializationService.getAllSpecializations();
    res.json(specializations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all available cities
router.get('/cities', async (req, res) => {
  try {
    const cities = await Doctor.distinct('location.city');
    res.json(cities.filter(city => city && city.trim()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Validate and add custom specialization
router.post('/specializations/validate', async (req, res) => {
  try {
    const { specialization } = req.body;
    const result = await SpecializationService.validateSpecialization(specialization);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get doctor categories with counts
router.get('/categories', async (req, res) => {
  try {
    const categories = await Doctor.aggregate([
      { $group: { _id: '$specialization', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const formattedCategories = categories.map((cat, index) => ({
      id: cat._id,
      name: cat._id,
      count: cat.count,
      icon: ['🏥', '❤️', '🦷', '👶', '👁️', '🧠', '🩺', '💊'][index % 8]
    }));
    
    res.json(formattedCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all doctors with AI-powered filtering
router.get('/', async (req, res) => {
  try {
    const { specialization, location, symptoms, sortBy = 'rating' } = req.query;
    
    let query = {};
    if (specialization) query.specialization = new RegExp(specialization, 'i');
    if (location) query['location.city'] = new RegExp(location, 'i');

    let doctors = await Doctor.find(query)
      .populate('userId', 'name email phone');
    
    // Sort with featured/boosted doctors first, then by requested sort
    doctors.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      if (a.visibilityBoost !== b.visibilityBoost) return b.visibilityBoost - a.visibilityBoost;
      return b[sortBy] - a[sortBy];
    });

    // AI-powered doctor matching if symptoms provided
    if (symptoms) {
      const symptomArray = symptoms.split(',').map(s => s.trim());
      const matchResults = await Promise.all(
        doctors.map(async (doctor) => {
          const match = await AIService.matchDoctor(symptomArray, location, {
            specialization: doctor.specialization
          });
          return { ...doctor.toObject(), aiMatch: match };
        })
      );
      
      // Sort by AI match score
      matchResults.sort((a, b) => b.aiMatch.matchScore - a.aiMatch.matchScore);
      return res.json(matchResults);
    }

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('userId', 'name email phone');
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get doctor availability
router.get('/:id/availability', async (req, res) => {
  try {
    const { date } = req.query;
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const requestedDate = new Date(date);
    const dayOfWeek = requestedDate.toLocaleDateString('en-US', { weekday: 'long' });
    
    const availability = doctor.availability.find(a => a.day === dayOfWeek);
    
    res.json({
      isAvailable: availability?.isAvailable || false,
      timeSlots: availability ? {
        startTime: availability.startTime,
        endTime: availability.endTime
      } : null,
      avgConsultationTime: doctor.avgConsultationTime
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get doctors grouped by specialization with boost/featured priority
router.get('/by-specialization', async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate('userId', 'name email phone')
      .sort({ isFeatured: -1, visibilityBoost: -1, finalRating: -1, rating: -1 });

    const doctorsBySpec = {};
    
    doctors.forEach(doctor => {
      const spec = doctor.specialization;
      if (!doctorsBySpec[spec]) {
        doctorsBySpec[spec] = [];
      }
      
      // Get current availability status
      const now = new Date();
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
      const currentTime = now.toTimeString().slice(0, 5);
      
      const todayAvailability = doctor.availability.find(a => a.day === currentDay);
      const nextAvailability = doctor.availability.find(a => a.isAvailable);
      
      let availabilityStatus = {
        isAvailable: false,
        timings: null,
        nextAvailable: null
      };
      
      if (todayAvailability && todayAvailability.isAvailable) {
        const startTime = todayAvailability.startTime;
        const endTime = todayAvailability.endTime;
        
        if (currentTime >= startTime && currentTime <= endTime) {
          availabilityStatus = {
            isAvailable: true,
            timings: { from: startTime, to: endTime },
            nextAvailable: null
          };
        }
      }
      
      if (!availabilityStatus.isAvailable && nextAvailability) {
        availabilityStatus.nextAvailable = {
          day: nextAvailability.day,
          from: nextAvailability.startTime,
          to: nextAvailability.endTime
        };
      }
      
      doctorsBySpec[spec].push({
        ...doctor.toObject(),
        availability: availabilityStatus
      });
    });
    
    // Sort doctors within each specialization (featured/boosted first)
    Object.keys(doctorsBySpec).forEach(spec => {
      doctorsBySpec[spec].sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        if (a.visibilityBoost !== b.visibilityBoost) return b.visibilityBoost - a.visibilityBoost;
        return (b.finalRating || b.rating) - (a.finalRating || a.rating);
      });
    });
    
    res.json(doctorsBySpec);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;