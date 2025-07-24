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
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Get patient's city from profile
    const profileKey = `patient_${user._id}_profile`;
    const patientProfile = JSON.parse(localStorage.getItem(profileKey) || '{}');
    const cityFromProfile = patientProfile.city; // No default - use actual city only
    
    console.log('=== PATIENT PROFILE DEBUG ===');
    console.log('Profile key:', profileKey);
    console.log('Patient profile:', patientProfile);
    console.log('Patient city from profile:', cityFromProfile);
    console.log('User ID:', user._id);
    console.log('============================');
    
    if (cityFromProfile) {
      const cleanCity = cityFromProfile.trim();
      setPatientCity(cleanCity);
      setSelectedCity(cleanCity);
      loadDoctors(cleanCity);
    } else {
      setLoading(false); // Stop loading if no city in profile
    }
  }, [user._id]);
  
  // Reload doctors when localStorage changes (doctor profile updates)
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('Storage change detected, reloading doctors for city:', selectedCity);
      setRefreshTrigger(prev => prev + 1);
      if (selectedCity) {
        loadDoctors(selectedCity);
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
  
  // Add manual refresh function
  const refreshDoctors = () => {
    console.log('Manual refresh triggered');
    if (selectedCity) {
      loadDoctors(selectedCity);
    }
  };

  const loadDoctors = async (city = patientCity) => {
    try {
      setLoading(true);
      
      // Get real doctors from localStorage profiles
      const realDoctors = [];
      
      // Check for saved doctor profiles
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('doctor_') && key.endsWith('_profile')) {
          try {
            const doctorProfile = JSON.parse(localStorage.getItem(key));
            const doctorId = key.replace('doctor_', '').replace('_profile', '');
            
            if (doctorProfile.city && doctorProfile.specialization) {
              // Get admin rating boost
              const adminBoosts = JSON.parse(localStorage.getItem('adminRatingBoosts') || '[]');
              const doctorBoosts = JSON.parse(localStorage.getItem('doctorBoosts') || '[]');
              const boost = adminBoosts.find(b => b.doctorId === doctorId) || 
                           doctorBoosts.find(b => b.doctorId === doctorId) || 
                           { boostAmount: 0 };
              
              const baseRating = 4.5;
              const finalRating = Math.min(5.0, baseRating + (boost.boostAmount || 0));
              
              realDoctors.push({
                _id: doctorId,
                userId: { name: doctorProfile.name || 'Doctor' },
                specialization: doctorProfile.specialization,
                experience: parseInt(doctorProfile.experience) || 5,
                consultationFee: parseInt(doctorProfile.consultationFee) || 500,
                rating: baseRating,
                finalRating: finalRating,
                adminBoost: boost.boostAmount || 0,
                qualification: doctorProfile.qualification?.split(',') || ['MBBS'],
                isVerified: true,
                location: { 
                  city: doctorProfile.city.trim(), 
                  address: `${doctorProfile.flatNo || ''} ${doctorProfile.street || ''}, ${doctorProfile.city}`.trim().replace(/^,\s*/, '')
                },
                availability: { isAvailable: true, timings: { from: '09:00', to: '17:00' } }
              });
            }
          } catch (error) {
            console.log('Error parsing doctor profile:', error);
          }
        }
      }
      
      // Mock doctors with different cities - fallback data
      const mockDoctors = [
        // Mumbai doctors
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
          _id: 'doc5',
          userId: { name: 'Neha Joshi' },
          specialization: 'Gynecology',
          experience: 12,
          consultationFee: 650,
          rating: 4.7,
          finalRating: 4.7,
          qualification: ['MBBS', 'MD Gynecology'],
          isVerified: true,
          location: { city: 'Mumbai', address: 'Powai, Mumbai' },
          availability: { isAvailable: true, timings: { from: '09:30', to: '17:30' } }
        },
        // Delhi doctors
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
          _id: 'doc6',
          userId: { name: 'Vikram Singh' },
          specialization: 'Orthopedics',
          experience: 18,
          consultationFee: 900,
          rating: 4.9,
          finalRating: 4.9,
          qualification: ['MBBS', 'MS Orthopedics'],
          isVerified: true,
          location: { city: 'Delhi', address: 'Lajpat Nagar, Delhi' },
          availability: { isAvailable: true, timings: { from: '10:00', to: '18:00' } }
        },
        // Bangalore doctors
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
        },
        // Pune doctors
        {
          _id: 'doc7',
          userId: { name: 'Ravi Deshmukh' },
          specialization: 'General Medicine',
          experience: 14,
          consultationFee: 550,
          rating: 4.4,
          finalRating: 4.4,
          qualification: ['MBBS', 'MD'],
          isVerified: true,
          location: { city: 'Pune', address: 'Koregaon Park, Pune' },
          availability: { isAvailable: true, timings: { from: '08:00', to: '16:00' } }
        },
        {
          _id: 'doc8',
          userId: { name: 'Kavita Joshi' },
          specialization: 'Gynecology',
          experience: 16,
          consultationFee: 750,
          rating: 4.7,
          finalRating: 4.7,
          qualification: ['MBBS', 'MD Gynecology'],
          isVerified: true,
          location: { city: 'Pune', address: 'Baner, Pune' },
          availability: { isAvailable: true, timings: { from: '10:00', to: '18:00' } }
        }
      ];

      // Combine real doctors with mock doctors
      const allDoctors = [...realDoctors, ...mockDoctors];
      
      // Get unique cities
      const cities = [...new Set(allDoctors.map(d => d.location.city))];
      setAvailableCities(cities);

      // Filter doctors by selected city (improved matching)
      const searchCity = city.toLowerCase().trim();
      const filteredDoctors = allDoctors.filter(d => {
        const doctorCity = d.location.city.toLowerCase().trim();
        return doctorCity === searchCity;
      });
      
      console.log('=== DEBUGGING CITY FILTER ===');
      console.log('Search city:', searchCity);
      console.log('Real doctors found:', realDoctors.length);
      console.log('Mock doctors available:', mockDoctors.length);
      console.log('Total doctors before filter:', allDoctors.length);
      console.log('Available cities:', [...new Set(allDoctors.map(d => d.location.city.toLowerCase().trim()))]);
      console.log('Real doctors by city:');
      realDoctors.forEach(d => {
        console.log(`  - REAL Dr. ${d.userId.name}: ${d.location.city} (${d.location.city.toLowerCase().trim()})`);  
      });
      console.log('Mock doctors by city:');
      mockDoctors.forEach(d => {
        console.log(`  - MOCK Dr. ${d.userId.name}: ${d.location.city} (${d.location.city.toLowerCase().trim()})`);  
      });
      console.log('Filtered doctors found:', filteredDoctors.length);
      console.log('==============================');
      
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
      const searchCity = customCity.trim();
      setSelectedCity(searchCity); // Update selected city to custom city
      setShowCustomInput(false); // Hide custom input after search
      loadDoctors(searchCity);
      setCustomCity(''); // Clear custom input field
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
      {/* Debug Panel */}
      <Card sx={{ mb: 2, bgcolor: 'grey.100' }}>
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>🔧 Debug Info:</Typography>
          <Typography variant="body2">Patient City: {patientCity || 'Not set'}</Typography>
          <Typography variant="body2">Selected City: {selectedCity || 'Not set'}</Typography>
          <Typography variant="body2">Available Cities: {availableCities.join(', ') || 'None'}</Typography>
          <Typography variant="body2">Total Doctors Found: {doctors.length}</Typography>
        </CardContent>
      </Card>
      
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
            Try selecting from available cities: {availableCities.join(', ')}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button 
              variant="contained"
              onClick={() => {
                if (availableCities.length > 0) {
                  const nearestCity = availableCities[0];
                  setSelectedCity(nearestCity);
                  loadDoctors(nearestCity);
                }
              }}
            >
              Show doctors in {availableCities[0] || 'nearby cities'}
            </Button>
            <Button 
              variant="outlined"
              onClick={() => {
                // Show all doctors for debugging
                console.log('Showing all doctors for debugging');
                const allDoctorsTest = [];
                
                // Get all doctor profiles
                for (let i = 0; i < localStorage.length; i++) {
                  const key = localStorage.key(i);
                  if (key && key.startsWith('doctor_') && key.endsWith('_profile')) {
                    try {
                      const doctorProfile = JSON.parse(localStorage.getItem(key));
                      const doctorId = key.replace('doctor_', '').replace('_profile', '');
                      console.log('Found doctor profile:', doctorProfile);
                      
                      if (doctorProfile.specialization) {
                        allDoctorsTest.push({
                          _id: doctorId,
                          userId: { name: doctorProfile.name || 'Doctor' },
                          specialization: doctorProfile.specialization,
                          experience: parseInt(doctorProfile.experience) || 5,
                          consultationFee: parseInt(doctorProfile.consultationFee) || 500,
                          rating: 4.5,
                          finalRating: 4.5,
                          qualification: ['MBBS'],
                          isVerified: true,
                          location: { 
                            city: doctorProfile.city || 'Unknown', 
                            address: `${doctorProfile.flatNo || ''} ${doctorProfile.street || ''}, ${doctorProfile.city || 'Unknown'}`.trim()
                          },
                          availability: { isAvailable: true, timings: { from: '09:00', to: '17:00' } }
                        });
                      }
                    } catch (error) {
                      console.log('Error parsing doctor profile:', error);
                    }
                  }
                }
                
                console.log('All doctors found:', allDoctorsTest);
                setDoctors(allDoctorsTest);
              }}
            >
              Show All Doctors (Debug)
            </Button>
          </Box>
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