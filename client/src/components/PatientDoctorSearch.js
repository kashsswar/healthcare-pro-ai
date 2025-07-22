import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, Chip, Button, 
  Avatar, TextField, InputAdornment, Accordion, AccordionSummary, AccordionDetails,
  Autocomplete, FormControl, Snackbar, Alert
} from '@mui/material';
import { Search, ExpandMore, Star, Verified, Schedule, LocationOn, FilterList, AutoAwesome } from '@mui/icons-material';
import axios from 'axios';
import QuickBookingForm from './QuickBookingForm';

const PatientDoctorSearch = ({ onBookAppointment, selectedCategory, user }) => {
  const [doctorsBySpec, setDoctorsBySpec] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSpecs, setFilteredSpecs] = useState({});
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  const [availableSpecs, setAvailableSpecs] = useState([]);
  const [refreshNotification, setRefreshNotification] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [aiRefreshActive, setAiRefreshActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingDialog, setBookingDialog] = useState({ open: false, doctor: null });
  const activityRef = useRef({
    lastSearch: new Date(),
    searchCount: 0,
    timeSpent: 0,
    lastRefresh: new Date()
  });
  const refreshIntervalRef = useRef(null);

  useEffect(() => {
    fetchDoctorsBySpecialization();
    if (aiRefreshActive) {
      startAIRefresh();
    }
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    filterSpecializations();
  }, [searchTerm, doctorsBySpec, selectedSpecialization, selectedCategory]);

  useEffect(() => {
    setAvailableSpecs(Object.keys(doctorsBySpec));
  }, [doctorsBySpec]);

  const fetchDoctorsBySpecialization = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/doctors/by-specialization');
      setDoctorsBySpec(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Fallback to regular doctors endpoint
      try {
        const fallbackResponse = await axios.get('/api/doctors');
        const doctors = fallbackResponse.data;
        
        // Group doctors by specialization
        const grouped = doctors.reduce((acc, doctor) => {
          const spec = doctor.specialization || 'General Medicine';
          if (!acc[spec]) acc[spec] = [];
          acc[spec].push({
            ...doctor,
            availability: {
              isAvailable: true,
              timings: { from: '09:00', to: '17:00' },
              nextAvailable: null
            }
          });
          return acc;
        }, {});
        
        setDoctorsBySpec(grouped);
      } catch (fallbackError) {
        console.error('All endpoints failed:', fallbackError);
        setError('Unable to load doctors. Using demo data.');
        // Use mock data as last resort
        setDoctorsBySpec({
          'General Medicine': [
            {
              _id: 'demo1',
              userId: { name: 'John Smith' },
              specialization: 'General Medicine',
              experience: 10,
              consultationFee: 500,
              rating: 4.5,
              finalRating: 4.5,
              qualification: ['MBBS', 'MD'],
              isVerified: true,
              availability: {
                isAvailable: true,
                timings: { from: '09:00', to: '17:00' }
              }
            }
          ],
          'Cardiology': [
            {
              _id: 'demo2',
              userId: { name: 'Sarah Johnson' },
              specialization: 'Cardiology',
              experience: 15,
              consultationFee: 800,
              rating: 4.8,
              finalRating: 4.8,
              qualification: ['MBBS', 'MD Cardiology'],
              isVerified: true,
              availability: {
                isAvailable: true,
                timings: { from: '10:00', to: '18:00' }
              }
            }
          ]
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshDoctors = async () => {
    await fetchDoctorsBySpecialization();
  };

  const startAIRefresh = async () => {
    try {
      // Get AI-determined refresh interval
      const intervalResponse = await axios.post('/api/ai/refresh-interval', {
        userType: 'patient',
        currentActivity: {
          engagement: 'high',
          sessionDuration: Math.floor(activityRef.current.timeSpent),
          actionFrequency: activityRef.current.searchCount,
          dataSensitivity: 'medium'
        }
      });
      
      const interval = intervalResponse.data.interval * 1000; // Convert to milliseconds
      
      refreshIntervalRef.current = setInterval(async () => {
        await checkAIRefresh();
      }, interval);
      
    } catch (error) {
      console.log('AI refresh API not available, using fallback interval');
      // Fallback to 3-minute intervals
      refreshIntervalRef.current = setInterval(async () => {
        await fetchDoctorsBySpecialization();
        setRefreshNotification('🤖 AI updated doctor recommendations');
        setShowNotification(true);
      }, 180000);
    }
  };

  const checkAIRefresh = async () => {
    try {
      const response = await axios.post('/api/ai/should-refresh-patient', {
        patientActivity: activityRef.current,
        lastRefresh: activityRef.current.lastRefresh
      });
      
      if (response.data.shouldRefresh) {
        await fetchDoctorsBySpecialization();
        activityRef.current.lastRefresh = new Date();
        
        // Get AI-generated notification
        const notificationResponse = await axios.post('/api/ai/refresh-notification', {
          userType: 'patient',
          refreshReason: response.data.reason,
          newDataSummary: 'Updated doctor availability and recommendations'
        });
        
        setRefreshNotification(notificationResponse.data.message);
        setShowNotification(true);
      }
    } catch (error) {
      console.log('AI refresh check failed, using smart fallback');
      // Smart fallback - refresh based on user activity
      const timeSinceLastRefresh = Date.now() - activityRef.current.lastRefresh.getTime();
      const shouldRefresh = timeSinceLastRefresh > 300000 && activityRef.current.searchCount > 2;
      
      if (shouldRefresh) {
        await fetchDoctorsBySpecialization();
        activityRef.current.lastRefresh = new Date();
        setRefreshNotification('🤖 AI found updated doctor recommendations for you!');
        setShowNotification(true);
      }
    }
  };

  const trackActivity = (action) => {
    activityRef.current.searchCount++;
    activityRef.current.lastSearch = new Date();
    activityRef.current.timeSpent = (Date.now() - activityRef.current.lastRefresh.getTime()) / 60000;
  };

  const filterSpecializations = () => {
    let filtered = { ...doctorsBySpec };

    // Filter by selected category from DoctorCategories component
    if (selectedCategory) {
      const categoryFiltered = {};
      Object.entries(doctorsBySpec).forEach(([spec, doctors]) => {
        if (spec.toLowerCase().includes(selectedCategory.toLowerCase())) {
          categoryFiltered[spec] = doctors;
        }
      });
      filtered = categoryFiltered;
    }
    // Filter by selected specialization from dropdown
    else if (selectedSpecialization) {
      const specFiltered = {};
      Object.entries(doctorsBySpec).forEach(([spec, doctors]) => {
        if (spec.toLowerCase().includes(selectedSpecialization.toLowerCase())) {
          specFiltered[spec] = doctors;
        }
      });
      filtered = specFiltered;
    }

    // Filter by search term
    if (searchTerm) {
      const searchFiltered = {};
      Object.entries(filtered).forEach(([spec, doctors]) => {
        const matchingDoctors = doctors.filter(doc => 
          doc.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          spec.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (matchingDoctors.length > 0) {
          searchFiltered[spec] = matchingDoctors;
        }
      });
      filtered = searchFiltered;
    }

    setFilteredSpecs(filtered);
  };

  const getAvailabilityDisplay = (availability) => {
    if (availability.isAvailable) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Chip label="Available" color="success" size="small" />
          <Typography variant="body2" color="success.main">
            {availability.timings.from} - {availability.timings.to}
          </Typography>
        </Box>
      );
    } else {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Chip label="Not Available" color="error" size="small" />
          {availability.nextAvailable && (
            <Typography variant="body2" color="error.main">
              Will be available {availability.nextAvailable.day}: {availability.nextAvailable.from} - {availability.nextAvailable.to}
            </Typography>
          )}
        </Box>
      );
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>🔍 Find Your Doctor</Typography>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" color="primary">🤖 AI is finding the best doctors for you...</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            Loading doctor profiles and availability
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 20, height: 20, bgcolor: 'primary.main', borderRadius: '50%',
              '@keyframes pulse': {
                '0%, 80%, 100%': { transform: 'scale(0)' },
                '40%': { transform: 'scale(1)' }
              },
              animation: 'pulse 1.5s ease-in-out infinite'
            }} />
            <Box sx={{ 
              width: 20, height: 20, bgcolor: 'primary.main', borderRadius: '50%',
              '@keyframes pulse': {
                '0%, 80%, 100%': { transform: 'scale(0)' },
                '40%': { transform: 'scale(1)' }
              },
              animation: 'pulse 1.5s ease-in-out 0.3s infinite'
            }} />
            <Box sx={{ 
              width: 20, height: 20, bgcolor: 'primary.main', borderRadius: '50%',
              '@keyframes pulse': {
                '0%, 80%, 100%': { transform: 'scale(0)' },
                '40%': { transform: 'scale(1)' }
              },
              animation: 'pulse 1.5s ease-in-out 0.6s infinite'
            }} />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error} Showing demo doctors for testing.
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">🔍 Find Your Doctor</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip 
            icon={<AutoAwesome />}
            label={aiRefreshActive ? "AI Auto-Refresh ON" : "AI Auto-Refresh OFF"}
            color={aiRefreshActive ? "success" : "default"}
            size="small"
            onClick={() => {
              setAiRefreshActive(!aiRefreshActive);
              if (!aiRefreshActive) {
                startAIRefresh();
              } else if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
              }
            }}
            sx={{ cursor: 'pointer' }}
          />
          <Button 
            variant="outlined" 
            onClick={refreshDoctors}
            size="small"
          >
            🔄 Manual Refresh
          </Button>
        </Box>
      </Box>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Search by doctor name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              trackActivity('search');
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiInputBase-root': { cursor: 'text' } }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            options={availableSpecs}
            value={selectedSpecialization}
            onChange={(event, newValue) => setSelectedSpecialization(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Filter by specialization..."
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterList />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiInputBase-root': { cursor: 'pointer' } }}
              />
            )}
            isClearable
          />
        </Grid>
      </Grid>
      
      {Object.entries(filteredSpecs).map(([specialization, doctors]) => (
        <Accordion key={specialization} defaultExpanded={Object.keys(filteredSpecs).length <= 3}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">
              {specialization} ({doctors.length} doctor{doctors.length !== 1 ? 's' : ''})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {doctors.map((doctor) => (
                <Grid item xs={12} md={6} lg={4} key={doctor._id}>
                  <Card 
                    sx={{ 
                      position: 'relative',
                      border: doctor.isFeatured ? '2px solid gold' : 'none',
                      boxShadow: doctor.isFeatured ? '0 4px 20px rgba(255,215,0,0.3)' : 'default',
                      '&:hover': { boxShadow: 6 }
                    }}
                  >
                    {doctor.isFeatured && (
                      <Chip 
                        label="⭐ FEATURED" 
                        color="warning" 
                        size="small" 
                        sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
                      />
                    )}
                    
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 50, height: 50 }}>
                          {doctor.userId.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6">
                            Dr. {doctor.userId.name}
                            {doctor.isVerified && <Verified color="primary" sx={{ ml: 1, fontSize: 16 }} />}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {doctor.qualification.join(', ') || 'Medical Professional'}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Star color="warning" />
                          <Typography variant="body1" fontWeight="bold">
                            {(doctor.finalRating || doctor.rating || 4.5).toFixed(1)}/5
                          </Typography>

                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <LocationOn fontSize="small" color="action" />
                          <Typography variant="body2" color="textSecondary">
                            {doctor.experience} years experience • {doctor.location?.city || 'Available Online'}
                          </Typography>
                        </Box>
                        
                        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                          ₹{doctor.consultationFee}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        {getAvailabilityDisplay(doctor.availability)}
                      </Box>

                      <Button 
                        variant={doctor.availability.isAvailable ? "contained" : "outlined"}
                        color={doctor.availability.isAvailable ? "primary" : "secondary"}
                        fullWidth
                        disabled={!doctor.availability.isAvailable}
                        startIcon={<Schedule />}
                        onClick={() => setBookingDialog({ open: true, doctor })}
                      >
                        {doctor.availability.isAvailable ? 'Book Appointment' : 'Schedule Later'}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
      
      {Object.keys(filteredSpecs).length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="textSecondary">
            No doctors found matching your search
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Try searching with different keywords
          </Typography>
        </Box>
      )}
      
      <Snackbar 
        open={showNotification} 
        autoHideDuration={4000} 
        onClose={() => setShowNotification(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setShowNotification(false)} 
          severity="info" 
          icon={<AutoAwesome />}
          sx={{ width: '100%' }}
        >
          {refreshNotification}
        </Alert>
      </Snackbar>
      
      {/* Booking Dialog */}
      <QuickBookingForm
        open={bookingDialog.open}
        onClose={() => setBookingDialog({ open: false, doctor: null })}
        doctor={bookingDialog.doctor}
        patient={user}
        onBookingConfirm={(appointmentData) => {
          console.log('Appointment booked:', appointmentData);
          if (onBookAppointment) {
            onBookAppointment(appointmentData);
          }
        }}
      />
    </Box>
  );
};

export default PatientDoctorSearch;