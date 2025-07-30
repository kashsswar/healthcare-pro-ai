import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Box, Rating, Collapse, Button
} from '@mui/material';
import { ExpandMore, ExpandLess, Star } from '@mui/icons-material';

function ReviewsList({ doctorId, patientId, userRole }) {
  const [reviews, setReviews] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (doctorId) {
      loadReviews();
    }
  }, [doctorId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const url = `${apiUrl}/api/reviews/doctor/${doctorId}`;
      
      console.log('=== LOADING REVIEWS ===');
      console.log('Doctor ID:', doctorId);
      console.log('Loading reviews from URL:', url);
      
      const response = await fetch(url);
      console.log('Reviews response status:', response.status);
      
      if (response.ok) {
        const reviewsData = await response.json();
        console.log('Reviews loaded:', reviewsData);
        console.log('Number of reviews:', reviewsData.length);
        setReviews(reviewsData);
      } else {
        const errorText = await response.text();
        console.log('Reviews loading error:', errorText);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!doctorId || reviews.length === 0) {
    return null;
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Button 
          onClick={() => setExpanded(!expanded)}
          startIcon={expanded ? <ExpandLess /> : <ExpandMore />}
          sx={{ textTransform: 'none', p: 0 }}
        >
          <Typography variant="h6">
            ⭐ Patient Reviews ({reviews.length})
          </Typography>
        </Button>
        
        <Collapse in={expanded}>
          <Box sx={{ mt: 2 }}>
            {loading ? (
              <Typography color="textSecondary">Loading reviews...</Typography>
            ) : (
              reviews.map((review) => (
                <Card key={review._id} sx={{ mb: 2, bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {review.patientName || 'Anonymous Patient'}
                      </Typography>
                      <Rating value={review.rating} readOnly size="small" />
                    </Box>
                    
                    {review.review && (
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                        "{review.review}"
                      </Typography>
                    )}
                    
                    <Typography variant="caption" color="textSecondary">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}

export default ReviewsList;