const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const SpecializationService = require('../utils/specializationService');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role, specialization, experience, consultationFee } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password, phone, role });
    await user.save();

    // Create doctor profile if role is doctor
    if (role === 'doctor') {
      // Validate and standardize specialization
      const validatedSpec = await SpecializationService.addCustomSpecialization(specialization);
      
      const doctor = new Doctor({
        userId: user._id,
        specialization: validatedSpec,
        experience: parseInt(experience),
        consultationFee: parseInt(consultationFee),
        qualification: [], // Can be added later
        availability: [
          { day: 'Monday', startTime: '09:00', endTime: '17:00', isAvailable: true },
          { day: 'Tuesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
          { day: 'Wednesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
          { day: 'Thursday', startTime: '09:00', endTime: '17:00', isAvailable: true },
          { day: 'Friday', startTime: '09:00', endTime: '17:00', isAvailable: true },
          { day: 'Saturday', startTime: '09:00', endTime: '13:00', isAvailable: true },
          { day: 'Sunday', startTime: '10:00', endTime: '12:00', isAvailable: false }
        ]
      });
      await doctor.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;