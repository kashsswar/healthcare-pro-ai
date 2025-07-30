import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Box, Rating, Collapse, Button
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

function PatientReviewHistory({ patientId }) {
  const [reviews, setReviews] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (patientId) {
      loadPatientReviews();
    }
  }, [patientId]);

  const loadPatientReviews = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const url = `${apiUrl}/api/reviews/patient/${patientId}`;
      
      console.log('=== LOADING PATIENT REVIEWS ===');
      console.log('Patient ID:', patientId);
      console.log('Loading patient reviews from URL:', url);
      
      const response = await fetch(url);
      console.log('Patient reviews response status:', response.status);
      
      if (response.ok) {
        const reviewsData = await response.json();
        console.log('Patient reviews loaded:', reviewsData);
        console.log('Number of patient reviews:', reviewsData.length);
        setReviews(reviewsData);
      } else {
        const errorText = await response.text();
        console.log('Patient reviews loading error:', errorText);
      }
    } catch (error) {
      console.error('Error loading patient reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  if (reviews.length === 0) {
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
            📝 My Reviews ({reviews.length})
          </Typography>
        </Button>
        
        <Collapse in={expanded}>
          <Box sx={{ mt: 2 }}>
            {loading ? (
              <Typography color="textSecondary">Loading reviews...</Typography>
            ) : (
              reviews.map((review) => (
                <Card key={review._id} sx={{ mb: 2, bgcolor: 'info.light' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Dr. {review.doctorName || 'Doctor'}
                      </Typography>
                      <Rating value={review.rating} readOnly size="small" />
                    </Box>
                    
                    {review.review && (
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                        "{review.review}"
                      </Typography>
                    )}
                    
                    <Typography variant="caption" color="textSecondary">
                      Reviewed on {new Date(review.createdAt).toLocaleDateString()}
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

export default PatientReviewHistory;