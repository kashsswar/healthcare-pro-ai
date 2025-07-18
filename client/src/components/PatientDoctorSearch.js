import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, Chip, Button, 
  Avatar, TextField, InputAdornment, Accordion, AccordionSummary, AccordionDetails,
  Autocomplete, FormControl, Snackbar, Alert
} from '@mui/material';
import { Search, ExpandMore, Star, Verified, Schedule, LocationOn, FilterList, AutoAwesome } from '@mui/icons-material';
import axios from 'axios';

const PatientDoctorSearch = ({ onBookAppointment, selectedCategory }) => {
  const [doctorsBySpec, setDoctorsBySpec] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSpecs, setFilteredSpecs] = useState({});
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  const [availableSpecs, setAvailableSpecs] = useState([]);
  const [refreshNotification, setRefreshNotification] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [aiRefreshActive, setAiRefreshActive] = useState(true);
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
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const response = await axios.get(`${apiUrl}/api/doctors/by-specialization`);
      setDoctorsBySpec(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
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
      // Fallback to 3-minute intervals
      refreshIntervalRef.current = setInterval(async () => {
        await checkAIRefresh();
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
      console.log('AI refresh check failed, using fallback');
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
      filtered = { [selectedCategory]: doctorsBySpec[selectedCategory] || [] };
    }
    // Filter by selected specialization from dropdown
    else if (selectedSpecialization) {
      filtered = { [selectedSpecialization]: doctorsBySpec[selectedSpecialization] || [] };
    }

    // Filter by search term
    if (searchTerm) {
      const searchFiltered = {};
      Object.entries(filtered).forEach(([spec, doctors]) => {
        if (spec.toLowerCase().includes(searchTerm.toLowerCase()) || 
            doctors.some(doc => doc.userId.name.toLowerCase().includes(searchTerm.toLowerCase()))) {
          searchFiltered[spec] = doctors.filter(doc => 
            doc.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            spec.toLowerCase().includes(searchTerm.toLowerCase())
          );
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

  return (
    <Box sx={{ p: 3 }}>
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
                            {doctor.finalRating || doctor.rating || 4.5}/5
                          </Typography>
                          {doctor.adminBoostRating > 0 && (
                            <Chip label={`+${doctor.adminBoostRating} Boost`} color="secondary" size="small" />
                          )}
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
                        onClick={() => onBookAppointment && onBookAppointment(doctor)}
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
    </Box>
  );
};

export default PatientDoctorSearch;