const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Submit a review
router.post('/', async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get reviews for a doctor
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const reviews = await Review.find({ doctorId: req.params.doctorId })
      .populate('patientId', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
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

module.exports = router;