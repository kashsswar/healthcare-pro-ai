const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Submit a review
router.post('/', async (req, res) => {
  try {
    console.log('=== REVIEW SUBMISSION API ===');
    console.log('Request body:', req.body);
    
    const review = new Review(req.body);
    console.log('Review object created:', review);
    
    await review.save();
    console.log('Review saved to database:', review);
    
    res.status(201).json(review);
  } catch (error) {
    console.error('Review submission error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get reviews for a doctor
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    console.log('=== GET DOCTOR REVIEWS API ===');
    console.log('Doctor ID:', req.params.doctorId);
    
    const reviews = await Review.find({ doctorId: req.params.doctorId })
      .populate('patientId', 'name')
      .sort({ createdAt: -1 });
    
    console.log('Found reviews:', reviews.length);
    console.log('Reviews data:', reviews);
    
    res.json(reviews);
  } catch (error) {
    console.error('Get doctor reviews error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get doctor stats (rating and review count)
router.get('/doctor/:doctorId/stats', async (req, res) => {
  try {
    const reviews = await Review.find({ doctorId: req.params.doctorId });
    const reviewCount = reviews.length;
    const averageRating = reviewCount > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount 
      : 0;
    
    res.json({
      reviewCount,
      averageRating: parseFloat(averageRating.toFixed(1))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get reviews by patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    console.log('=== GET PATIENT REVIEWS API ===');
    console.log('Patient ID:', req.params.patientId);
    
    const reviews = await Review.find({ patientId: req.params.patientId })
      .populate('doctorId', 'name')
      .sort({ createdAt: -1 });
    
    console.log('Found patient reviews:', reviews.length);
    console.log('Patient reviews data:', reviews);
    
    res.json(reviews);
  } catch (error) {
    console.error('Get patient reviews error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;