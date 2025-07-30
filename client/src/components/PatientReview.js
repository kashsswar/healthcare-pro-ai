import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  Rating, TextField, Typography, Box, Alert
} from '@mui/material';
import { Star } from '@mui/icons-material';

function PatientReview({ open, onClose, doctor, patient, onReviewSubmit }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please provide a rating');
      return;
    }

    setSubmitting(true);
    try {
      const reviewData = {
        doctorId: doctor._id || doctor.userId?._id,
        patientId: patient._id || patient.id,
        patientName: patient.name,
        rating: rating,
        review: review
      };

      // Save review to API
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const savedReview = await response.json();

      if (onReviewSubmit) {
        onReviewSubmit(savedReview, rating);
      }

      alert('Review submitted successfully!');
      setRating(0);
      setReview('');
      onClose();
    } catch (error) {
      console.error('Review submission error:', error);
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Star color="warning" />
          Rate Dr. {doctor?.userId?.name || doctor?.name}
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            How was your experience with Dr. {doctor?.userId?.name || doctor?.name}?
          </Typography>
          
          <Box sx={{ my: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Your Rating
            </Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              size="large"
              sx={{ fontSize: '2rem' }}
            />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              {rating === 0 && 'Click to rate'}
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </Typography>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Write your review (optional)"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience with other patients..."
            sx={{ mt: 2 }}
          />

          <Alert severity="info" sx={{ mt: 2 }}>
            Your review will help other patients make informed decisions.
          </Alert>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={submitting || rating === 0}
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PatientReview;