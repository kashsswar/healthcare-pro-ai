import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, Button, 
  Avatar, Rating, Chip, Alert, FormControl, InputLabel, Select, MenuItem,
  TextField, Switch, FormControlLabel
} from '@mui/material';
import { LocationOn, Star, Schedule } from '@mui/icons-material';
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

  useEffect(() => {
    // Get patient's city from profile
    const patientProfile = JSON.parse(localStorage.getItem(`patient_${user._id}_profile`) || '{}');
    const cityFromProfile = patientProfile.address?.split(',').pop()?.trim() || 'Mumbai';
    setPatientCity(cityFromProfile);
    setSelectedCity(cityFromProfile);
    
    loadDoctors(cityFromProfile);
  }, [user._id]);

  const loadDoctors = async (city = patientCity) => {
    try {
      setLoading(true);
      
      // Mock doctors with different cities
      const mockDoctors = [
        {
          _id: 'doc1',
          userId: { name: 'Rajesh Kumar' },
          specialization: 'General Medicine',
          experience: 10,
          consultationFee: 500,
          rating: 4.5,
          finalRating: 4.5,
          qualification: ['MBBS', 'MD'],
          isVerified: true,
          location: { city: 'Mumbai', address: 'Andheri West, Mumbai' },
          availability: { isAvailable: true, timings: { from: '09:00', to: '17:00' } }
        },
        {
          _id: 'doc2',
          userId: { name: 'Priya Sharma' },
          specialization: 'Cardiology',
          experience: 15,
          consultationFee: 800,
          rating: 4.8,
          finalRating: 4.8,
          qualification: ['MBBS', 'MD Cardiology'],
          isVerified: true,
          location: { city: 'Mumbai', address: 'Bandra, Mumbai' },
          availability: { isAvailable: true, timings: { from: '10:00', to: '18:00' } }
        },
        {
          _id: 'doc3',
          userId: { name: 'Amit Patel' },
          specialization: 'Dermatology',
          experience: 8,
          consultationFee: 600,
          rating: 4.3,
          finalRating: 4.3,
          qualification: ['MBBS', 'MD Dermatology'],
          isVerified: true,
          location: { city: 'Delhi', address: 'Connaught Place, Delhi' },
          availability: { isAvailable: true, timings: { from: '11:00', to: '19:00' } }
        },
        {
          _id: 'doc4',
          userId: { name: 'Sunita Reddy' },
          specialization: 'Pediatrics',
          experience: 12,
          consultationFee: 700,
          rating: 4.6,
          finalRating: 4.6,
          qualification: ['MBBS', 'MD Pediatrics'],
          isVerified: true,
          location: { city: 'Bangalore', address: 'Koramangala, Bangalore' },
          availability: { isAvailable: true, timings: { from: '09:00', to: '16:00' } }
        }
      ];

      // Get unique cities
      const cities = [...new Set(mockDoctors.map(d => d.location.city))];
      setAvailableCities(cities);

      // Filter doctors by selected city
      const filteredDoctors = mockDoctors.filter(d => d.location.city === city);
      setDoctors(filteredDoctors);

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
      loadDoctors(customCity.trim());
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6">🔍 Finding doctors in your area...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Location Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📍 Your Location: {patientCity}
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
      <Typography variant="h6" gutterBottom>
        Doctors in {selectedCity === 'other' ? (customCity || 'Custom Location') : selectedCity} ({doctors.length})
      </Typography>

      {doctors.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="h6">No doctors found in {selectedCity === 'other' ? (customCity || 'this location') : selectedCity}</Typography>
          <Typography variant="body2">
            We don't have any doctors available in this city yet. 
            Try selecting a different city or check back later.
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Star color="warning" />
                      <Typography variant="body1" fontWeight="bold">
                        {(doctor.finalRating || doctor.rating).toFixed(1)}/5
                      </Typography>
                    </Box>
                    
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