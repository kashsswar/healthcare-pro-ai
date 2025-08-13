import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, Button, 
  Avatar, Rating, Chip, Alert, FormControl, InputLabel, Select, MenuItem,
  TextField, Switch, FormControlLabel, Collapse
} from '@mui/material';
import { LocationOn, Star, Schedule, ExpandMore, ExpandLess } from '@mui/icons-material';
import axios from 'axios';
import QuickBookingForm from './QuickBookingForm';

function DoctorsByLocation({ user, onBookAppointment }) {
  const [doctors, setDoctors] = useState([]);
  const [patientCity, setPatientCity] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showOtherCities, setShowOtherCities] = useState(false);
  const [availableCities, setAvailableCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customCity, setCustomCity] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [bookingDialog, setBookingDialog] = useState({ open: false, doctor: null });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [doctorReviews, setDoctorReviews] = useState({});
  const [expandedReviews, setExpandedReviews] = useState({});

  useEffect(() => {
    loadPatientProfile();
  }, [user._id]);
  
  const loadPatientProfile = async () => {
    try {
      const userId = user._id || user.id;
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/patient-profile/${userId}`);
      
      if (response.ok) {
        const patientData = await response.json();
        const cityFromProfile = patientData.profile?.city;
        
        if (cityFromProfile) {
          const cleanCity = cityFromProfile.trim();
          setPatientCity(cleanCity);
          setSelectedCity(cleanCity);
          loadDoctors(cleanCity);
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading patient profile:', error);
      setLoading(false);
    }
  };
  
  // Reload doctors when localStorage changes (doctor profile updates)
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('Storage change detected, reloading doctors for city:', selectedCity);
      setRefreshTrigger(prev => prev + 1);
      if (selectedCity) {
        setTimeout(() => loadDoctors(selectedCity), 100); // Small delay to ensure localStorage is updated
      }
    };
    
    // Listen for all profile update events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('doctorProfileUpdated', handleStorageChange);
    window.addEventListener('patientProfileUpdated', handleStorageChange);
    window.addEventListener('adminRatingUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('doctorProfileUpdated', handleStorageChange);
      window.removeEventListener('patientProfileUpdated', handleStorageChange);
      window.removeEventListener('adminRatingUpdated', handleStorageChange);
    };
  }, [selectedCity]);
  
  // Auto-refresh every 10 seconds to catch any missed updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedCity) {
        loadDoctors(selectedCity);
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [selectedCity]);
  
  // Add manual refresh function
  const refreshDoctors = () => {
    console.log('Manual refresh triggered');
    if (selectedCity) {
      loadDoctors(selectedCity);
    }
  };

  const loadReviewStats = async (doctorId) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/reviews/doctor/${doctorId}/rating`);
      if (response.ok) {
        const ratingData = await response.json();
        console.log(`Rating data for doctor ${doctorId}:`, ratingData);
        return ratingData;
      }
    } catch (error) {
      console.error('Error loading review stats:', error);
    }
    return { reviewCount: 0, finalRating: 4.5, hasReviews: false };
  };

  const loadDoctorReviews = async (doctorId) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
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

  const loadDoctors = async (city = patientCity) => {
    try {
      setLoading(true);
      
      // Get doctors from API only
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/doctors?location=${encodeURIComponent(city)}`);
      
      let doctors = [];
      if (response.ok) {
        doctors = await response.json();
      }
      
      // Get all available cities from API
      const citiesResponse = await fetch(`${apiUrl}/api/doctors/cities`);
      let cities = [];
      if (citiesResponse.ok) {
        cities = await citiesResponse.json();
      }
      setAvailableCities(cities);

      // Filter doctors by selected city
      const searchCity = city.toLowerCase().trim();
      const filteredDoctors = doctors.filter(d => {
        const doctorCity = (d.location?.city || '').toLowerCase().trim();
        return doctorCity === searchCity;
      });
      
      console.log('=== DEBUGGING CITY FILTER ===');
      console.log('Search city:', searchCity);
      console.log('API doctors found:', doctors.length);
      console.log('Available cities:', cities);
      console.log('Filtered doctors found:', filteredDoctors.length);
      console.log('==============================');
      
      // Load review stats for each doctor
      console.log('=== LOADING REVIEW STATS FOR DOCTORS ===');
      const doctorsWithReviews = await Promise.all(
        filteredDoctors.map(async (doctor) => {
          console.log(`Loading rating for doctor ${doctor._id} (${doctor.userId.name})`);
          const ratingData = await loadReviewStats(doctor._id);
          console.log(`Rating data received:`, ratingData);
          const updatedDoctor = {
            ...doctor,
            reviewCount: ratingData.reviewCount,
            finalRating: ratingData.finalRating,
            adminBoost: ratingData.adminBoost,
            hasReviews: ratingData.hasReviews
          };
          console.log(`Updated doctor:`, updatedDoctor);
          return updatedDoctor;
        })
      );
      console.log('=== FINAL DOCTORS WITH REVIEWS ===');
      console.log(doctorsWithReviews);
      
      setDoctors(doctorsWithReviews);

    } catch (error) {
      console.error('Error loading doctors:', error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (newCity) => {
    setSelectedCity(newCity);
    if (newCity === 'other') {
      setShowCustomInput(true);
      setDoctors([]); // Clear doctors while waiting for custom input
    } else {
      setShowCustomInput(false);
      loadDoctors(newCity);
    }
  };

  const handleCustomCitySearch = () => {
    if (customCity.trim()) {
      const searchCity = customCity.trim();
      setSelectedCity(searchCity);
      setShowCustomInput(false);
      setShowOtherCities(false);
      loadDoctors(searchCity);
      setCustomCity('');
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6">🔍 Finding doctors in your area...</Typography>
      </Box>
    );
  }
  
  if (!patientCity) {
    return (
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="h6">📍 Complete Your Profile</Typography>
        <Typography variant="body2">
          Please add your city in the Patient Profile section above to see doctors in your area.
        </Typography>
      </Alert>
    );
  }

  return (
    <Box>

      
      {/* Location Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📍 {showOtherCities && selectedCity !== patientCity ? `Searching in: ${selectedCity}` : `Your Location: ${patientCity}`}
          </Typography>
          
          <FormControlLabel
            control={
              <Switch
                checked={showOtherCities}
                onChange={(e) => {
                  setShowOtherCities(e.target.checked);
                  if (!e.target.checked) {
                    // Reset to patient's city when toggled off
                    setSelectedCity(patientCity);
                    loadDoctors(patientCity);
                  }
                }}
              />
            }
            label="Show doctors in other cities"
          />

          {showOtherCities && (
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth sx={{ 
                '& .MuiInputBase-root': { cursor: 'pointer' },
                '& .MuiSelect-select': { cursor: 'pointer' },
                '& .MuiInputBase-input': { cursor: 'pointer' }
              }}>
                <InputLabel>Select City</InputLabel>
                <Select
                  value={selectedCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  label="Select City"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        overflow: 'auto'
                      }
                    }
                  }}
                >
                  <MenuItem value={patientCity}>📍 {patientCity} (Your City)</MenuItem>
                  {availableCities.filter(city => city !== patientCity).map((city) => (
                    <MenuItem key={city} value={city}>
                      📍 {city}
                    </MenuItem>
                  ))}
                  <MenuItem value="other">📋 Other (Enter custom location)</MenuItem>
                  <MenuItem disabled sx={{ justifyContent: 'center', bgcolor: 'primary.main', color: 'white' }}>
                    <Button 
                      size="small" 
                      variant="contained" 
                      onClick={() => document.activeElement.blur()}
                      sx={{ minWidth: '60px' }}
                    >
                      OK
                    </Button>
                  </MenuItem>
                </Select>
              </FormControl>
              
              {showCustomInput && (
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Enter City Name"
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    placeholder="e.g., Pune, Chennai, Kolkata"
                    sx={{ 
                      '& .MuiInputBase-root': { cursor: 'text' },
                      '& .MuiInputBase-input': { cursor: 'text' },
                      '& input': { cursor: 'text !important' }
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleCustomCitySearch}
                    disabled={!customCity.trim()}
                  >
                    Search
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Doctors in {selectedCity} ({doctors.length})
        </Typography>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={refreshDoctors}
        >
          🔄 Refresh
        </Button>
      </Box>

      {doctors.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="h6">No doctors found in {selectedCity}</Typography>
          <Typography variant="body2">
            We don't have any doctors available in this city yet.
          </Typography>
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {doctors.map((doctor) => (
            <Grid item xs={12} md={6} key={doctor._id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 50, height: 50 }}>
                      {doctor.userId.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        Dr. {doctor.userId.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {doctor.specialization}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1, 
                        mb: 1,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'grey.100', borderRadius: 1, p: 0.5, m: -0.5 }
                      }}
                      onClick={() => toggleReviews(doctor._id)}
                    >
                      <Star color="warning" />
                      <Typography variant="body1" fontWeight="bold">
                        {(doctor.finalRating || doctor.rating).toFixed(1)} ({doctor.reviewCount || 0} reviews)
                      </Typography>
                      {expandedReviews[doctor._id] ? <ExpandLess /> : <ExpandMore />}
                    </Box>
                    
                    <Collapse in={expandedReviews[doctor._id]}>
                      <Box sx={{ mt: 2, maxHeight: 200, overflowY: 'auto' }}>
                        {doctorReviews[doctor._id] ? (
                          doctorReviews[doctor._id].length === 0 ? (
                            <Typography variant="body2" color="textSecondary">
                              No reviews yet. Be the first to review this doctor!
                            </Typography>
                          ) : (
                            doctorReviews[doctor._id].map((review) => (
                              <Card key={review._id} sx={{ mb: 1, bgcolor: 'grey.50' }}>
                                <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="subtitle2" fontWeight="bold">
                                      {review.patientName || 'Anonymous'}
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
                          )
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            Loading reviews...
                          </Typography>
                        )}
                      </Box>
                    </Collapse>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2" color="textSecondary">
                        {doctor.location.address}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="textSecondary">
                      {doctor.experience} years experience
                    </Typography>
                    
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                      ₹{doctor.consultationFee}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    {doctor.availability.isAvailable ? (
                      <Chip label="Available Today" color="success" size="small" />
                    ) : (
                      <Chip label="Not Available" color="error" size="small" />
                    )}
                  </Box>

                  <Button 
                    variant="contained"
                    fullWidth
                    startIcon={<Schedule />}
                    onClick={() => setBookingDialog({ open: true, doctor })}
                    disabled={!doctor.availability.isAvailable}
                  >
                    {doctor.availability.isAvailable ? 'Book Appointment' : 'Schedule Later'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Booking Dialog */}
      <QuickBookingForm
        open={bookingDialog.open}
        onClose={() => setBookingDialog({ open: false, doctor: null })}
        doctor={bookingDialog.doctor}
        patient={user}
        onBookingConfirm={(appointmentData) => {
          console.log('Appointment booked:', appointmentData);
          // Trigger refresh in parent component if needed
          if (onBookAppointment) {
            onBookAppointment(appointmentData);
          }
        }}
      />
      

    </Box>
  );
}

export default DoctorsByLocation;