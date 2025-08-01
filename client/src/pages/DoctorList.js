import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Card, CardContent, Typography, Button, 
  TextField, Chip, Rating, Box, InputAdornment, Collapse 
} from '@mui/material';
import { Search, LocationOn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { doctorAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import ShareDoctor from '../components/ShareDoctor';
import DoctorCategories from '../components/DoctorCategories';
import PatientReview from '../components/PatientReview';
import QuickBookingForm from '../components/QuickBookingForm';

function DoctorList({ user }) {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [loading, setLoading] = useState(false);
  const [shareDoctor, setShareDoctor] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [reviewDialog, setReviewDialog] = useState({ open: false, doctor: null });
  const [bookingDialog, setBookingDialog] = useState({ open: false, doctor: null });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [doctorReviews, setDoctorReviews] = useState({});
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    loadDoctors(selectedCategory);
    
    // Auto-refresh when profiles change
    const handleRefresh = () => {
      console.log('Auto-refreshing doctor list...');
      setRefreshTrigger(prev => prev + 1);
      loadDoctors(selectedCategory);
    };
    
    window.addEventListener('doctorProfileUpdated', handleRefresh);
    window.addEventListener('adminRatingUpdated', handleRefresh);
    window.addEventListener('storage', handleRefresh);
    
    return () => {
      window.removeEventListener('doctorProfileUpdated', handleRefresh);
      window.removeEventListener('adminRatingUpdated', handleRefresh);
      window.removeEventListener('storage', handleRefresh);
    };
  }, [selectedCategory]);


  
  const filterDoctors = React.useCallback(() => {
    if (!searchTerm) {
      setFilteredDoctors(doctors);
      return;
    }

    const filtered = doctors.filter(doctor => {
      const doctorName = doctor.userId?.name || '';
      const specialization = doctor.specialization || '';
      const city = doctor.location?.city || '';
      
      return doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
             city.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    console.log(`Filtered ${filtered.length} doctors from ${doctors.length} total`);
    setFilteredDoctors(filtered);
  }, [searchTerm, doctors]);

  useEffect(() => {
    filterDoctors();
  }, [searchTerm, doctors, filterDoctors]);

  const loadRatingData = async (doctorId) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const url = `${apiUrl}/api/reviews/doctor/${doctorId}/stats`;
      console.log(`Loading rating from: ${url}`);
      
      const response = await fetch(url);
      console.log(`Response status: ${response.status}`);
      
      if (response.ok) {
        const statsData = await response.json();
        console.log(`Stats data:`, statsData);
        
        return {
          reviewCount: statsData.reviewCount || 0,
          finalRating: statsData.averageRating || 4.5,
          adminBoost: 0,
          hasReviews: (statsData.reviewCount || 0) > 0
        };
      }
    } catch (error) {
      console.error('Rating API error:', error);
    }
    
    return { reviewCount: 0, finalRating: 4.5, hasReviews: false };
  };

  const loadDoctorReviews = async (doctorId) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/api/reviews/doctor/${doctorId}`);
      if (response.ok) {
        const reviews = await response.json();
        setDoctorReviews(prev => ({ ...prev, [doctorId]: reviews }));
      }
    } catch (error) {
      console.error('Error loading doctor reviews:', error);
    }
  };

  const toggleReviews = (doctorId) => {
    setExpandedReviews(prev => ({ ...prev, [doctorId]: !prev[doctorId] }));
    if (!doctorReviews[doctorId]) {
      loadDoctorReviews(doctorId);
    }
  };

  const loadDoctors = async (category = null) => {
    try {
      setLoading(true);
      console.log('Loading doctors for category:', category);
      
      const apiUrl = process.env.REACT_APP_API_URL;
      let url = `${apiUrl}/api/doctors`;
      if (category) {
        url += `?specialization=${encodeURIComponent(category)}`;
      }
      
      console.log('Fetching from URL:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API response:', data);
      
      if (Array.isArray(data)) {
        console.log('=== LOADING RATING DATA FOR EACH DOCTOR ===');
        console.log('Raw doctors data:', data);
        
        // Load rating data for each doctor
        const doctorsWithRatings = await Promise.all(
          data.map(async (doctor) => {
            const doctorId = doctor.userId?._id || doctor._id;
            console.log(`Doctor object:`, doctor);
            console.log(`Doctor ID for rating: ${doctorId}`);
            console.log(`Doctor name: ${doctor.userId?.name}`);
            
            const ratingData = await loadRatingData(doctorId);
            console.log(`Rating data received for ${doctorId}:`, ratingData);
            
            const updatedDoctor = {
              ...doctor,
              reviewCount: ratingData.reviewCount || 0,
              finalRating: ratingData.finalRating || 4.5,
              adminBoost: ratingData.adminBoost || 0,
              hasReviews: ratingData.hasReviews || false
            };
            
            console.log(`Updated doctor ${doctorId}:`, updatedDoctor);
            return updatedDoctor;
          })
        );
        
        console.log('Doctors with ratings:', doctorsWithRatings);
        setDoctors(doctorsWithRatings);
        setFilteredDoctors(doctorsWithRatings);
        console.log(`Loaded ${doctorsWithRatings.length} doctors with ratings`);
      } else {
        console.error('API did not return array:', data);
        setDoctors([]);
        setFilteredDoctors([]);
      }
    } catch (error) {
      console.error('Error loading doctors:', error);
      setDoctors([]);
      setFilteredDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAISearch = async () => {
    if (!searchTerm.trim()) return;
    
    try {
      setLoading(true);
      
      const apiUrl = process.env.REACT_APP_API_URL;
      const url = `${apiUrl}/api/ai-search/search?query=${encodeURIComponent(searchTerm)}`;
      
      console.log('AI Search URL:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('AI Search response:', data);
      
      if (Array.isArray(data)) {
        setFilteredDoctors(data);
        console.log(`AI found ${data.length} matching doctors`);
      } else {
        setFilteredDoctors([]);
      }
      
    } catch (error) {
      console.error('AI search error:', error);
      setFilteredDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('findDoctor')}
      </Typography>
      
      <DoctorCategories 
        onCategorySelect={(category) => {
          console.log('Category selected:', category);
          setSelectedCategory(category);
          loadDoctors(category);
        }}
        selectedCategory={selectedCategory}
      />
      
      {/* AI Search */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={10}>
          <TextField
            fullWidth
            placeholder="Search by doctor name, specialization, city"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAISearch()}
            helperText="AI will understand if you're searching by name/location or describing symptoms"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Button 
            fullWidth 
            variant="contained" 
            onClick={handleAISearch}
            disabled={!searchTerm.trim() || loading}
            sx={{ height: '56px' }}
          >
            🤖 AI Search
          </Button>
        </Grid>
      </Grid>

      {/* Doctor Cards */}
      <Grid container spacing={3}>
        {filteredDoctors.map((doctor) => (
          <Grid item xs={12} md={6} lg={4} key={doctor._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Doctor {doctor.userId?.name}
                </Typography>
                
                <Chip 
                  label={doctor.specialization} 
                  color="primary" 
                  size="small" 
                  sx={{ mb: 2 }}
                />
                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 1,
                    cursor: 'pointer',
                    p: 0.5,
                    borderRadius: 1,
                    border: '1px solid transparent',
                    '&:hover': { 
                      bgcolor: 'primary.light', 
                      borderColor: 'primary.main',
                      transform: 'scale(1.02)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => {
                    const doctorId = doctor.userId?._id || doctor._id;
                    console.log('Toggling reviews for doctor:', doctorId);
                    toggleReviews(doctorId);
                  }}
                >
                  <Rating value={doctor.finalRating || doctor.rating} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1, color: 'primary.main', fontWeight: 'bold' }}>
                    {(doctor.finalRating || doctor.rating || 0).toFixed(1)} ({doctor.reviewCount || 0} reviews) 👆
                  </Typography>
                </Box>
                
                <Collapse in={expandedReviews[doctor.userId?._id || doctor._id]}>
                  <Box sx={{ mb: 2, maxHeight: 150, overflowY: 'auto', bgcolor: 'grey.50', p: 1, borderRadius: 1 }}>
                    {doctorReviews[doctor.userId?._id || doctor._id] ? (
                      doctorReviews[doctor.userId?._id || doctor._id].length === 0 ? (
                        <Typography variant="body2" color="textSecondary">
                          No reviews yet. Be the first to review!
                        </Typography>
                      ) : (
                        doctorReviews[doctor.userId?._id || doctor._id].map((review) => (
                          <Box key={review._id} sx={{ mb: 1, p: 1, bgcolor: 'white', borderRadius: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {review.patientName}
                              </Typography>
                              <Rating value={review.rating} readOnly size="small" />
                            </Box>
                            {review.review && (
                              <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                                "{review.review}"
                              </Typography>
                            )}
                            <Typography variant="caption" color="textSecondary">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        ))
                      )
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Loading reviews...
                      </Typography>
                    )}
                  </Box>
                </Collapse>
                
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  Experience: {doctor.experience} years
                </Typography>
                
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  Fee: ₹{doctor.consultationFee}
                </Typography>
                
                {doctor.location?.city && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                      {doctor.location.city}
                    </Typography>
                  </Box>
                )}
                
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Avg. consultation: {doctor.avgConsultationTime} min
                </Typography>
                
                {doctor.aiMatch && (
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={`${Math.round(doctor.aiMatch.matchScore * 100)}% AI Match`}
                      color="success"
                      size="small"
                    />
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      {doctor.aiMatch.reasoning}
                    </Typography>
                  </Box>
                )}
                
                {doctor.isVerified && (
                  <Chip label="Verified" color="success" size="small" sx={{ mb: 2 }} />
                )}
              </CardContent>
              
              <Box sx={{ p: 2, pt: 0 }}>
                <Button 
                  fullWidth 
                  variant="contained"
                  onClick={() => setBookingDialog({ open: true, doctor })}
                  sx={{ mb: 1 }}
                >
                  {t('bookAppointment')}
                </Button>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    variant="outlined"
                    onClick={() => setShareDoctor(doctor)}
                    size="small"
                    sx={{ flex: 1 }}
                  >
                    📱 Share
                  </Button>
                  <Button 
                    variant="outlined"
                    color="warning"
                    onClick={() => setReviewDialog({ open: true, doctor })}
                    size="small"
                    sx={{ flex: 1 }}
                  >
                    ⭐ Review
                  </Button>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <ShareDoctor 
        doctor={shareDoctor} 
        open={!!shareDoctor} 
        onClose={() => setShareDoctor(null)} 
      />
      
      <PatientReview
        open={reviewDialog.open}
        onClose={() => setReviewDialog({ open: false, doctor: null })}
        doctor={reviewDialog.doctor}
        patient={user}
        onReviewSubmit={(reviewData, newRating) => {
          // Update the doctor's rating in the current list
          setDoctors(prev => prev.map(d => 
            d._id === reviewData.doctorId 
              ? { ...d, rating: newRating, finalRating: newRating + (d.adminBoostRating || 0) }
              : d
          ));
          setFilteredDoctors(prev => prev.map(d => 
            d._id === reviewData.doctorId 
              ? { ...d, rating: newRating, finalRating: newRating + (d.adminBoostRating || 0) }
              : d
          ));
        }}
      />
      
      <QuickBookingForm
        open={bookingDialog.open}
        onClose={() => setBookingDialog({ open: false, doctor: null })}
        doctor={bookingDialog.doctor}
        patient={user}
        onBookingConfirm={(appointmentData) => {
          console.log('Appointment booked from doctor list:', appointmentData);
        }}
      />
      
      {filteredDoctors.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="textSecondary">
            No doctors found matching your criteria
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Try adjusting your search terms or symptoms
          </Typography>
        </Box>
      )}
    </Container>
  );
}

export default DoctorList;