import React, { useState } from 'react';
import { 
  Card, CardContent, Typography, TextField, Button, 
  Box, List, ListItem, ListItemText, Chip, Grid, FormControl, 
  InputLabel, Select, MenuItem
} from '@mui/material';
import { Search, AccessTime, LocalHospital } from '@mui/icons-material';

function DoctorAvailabilityChecker() {
  const [searchParams, setSearchParams] = useState({
    time: '',
    specialization: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [searching, setSearching] = useState(false);

  const specializations = [
    'General Medicine', 'Cardiology', 'Dermatology', 'Pediatrics',
    'Orthopedics', 'Gynecology', 'Neurology', 'Psychiatry',
    'Ophthalmology', 'ENT', 'Dentistry', 'Radiology'
  ];

  const searchAvailableDoctors = async () => {
    if (!searchParams.time || !searchParams.specialization) {
      alert('Please select both time and specialization');
      return;
    }

    setSearching(true);
    
    // Get real doctors from API or create sample data
    setTimeout(async () => {
      let allDoctors = [];
      
      try {
        // Try to get real doctors from API
        const response = await fetch('/api/doctors');
        if (response.ok) {
          allDoctors = await response.json();
        }
      } catch (error) {
        console.log('Using sample doctors');
      }
      
      // If no real doctors, use sample data
      if (allDoctors.length === 0) {
        allDoctors = [
          {
            _id: '507f1f77bcf86cd799439011',
            userId: { name: 'Dr. Sarah Johnson' },
            specialization: 'General Medicine',
            rating: 4.8,
            consultationFee: 500
          },
          {
            _id: '507f1f77bcf86cd799439012', 
            userId: { name: 'Dr. Michael Chen' },
            specialization: 'Cardiology',
            rating: 4.6,
            consultationFee: 600
          },
          {
            _id: '507f1f77bcf86cd799439013',
            userId: { name: 'Dr. Priya Sharma' },
            specialization: 'Dermatology', 
            rating: 4.9,
            consultationFee: 450
          }
        ];
      }
      
      // Filter by specialization first
      const specializationFiltered = allDoctors.filter(doctor => 
        doctor.specialization === searchParams.specialization
      );

      // Check time availability
      const timeHour = parseInt(searchParams.time.split(':')[0]);
      const timeMinutes = parseInt(searchParams.time.split(':')[1]);
      const searchTimeInMinutes = timeHour * 60 + timeMinutes;
      
      const filtered = specializationFiltered.filter(doctor => {
        // Check if doctor is available (from availability toggle)
        const doctorAvailabilityStatus = localStorage.getItem(`doctor_${doctor._id}_availability`);
        if (doctorAvailabilityStatus) {
          const status = JSON.parse(doctorAvailabilityStatus);
          if (!status.isAvailable) return false;
        }
        
        // Check time slots
        const doctorTimeSlots = localStorage.getItem(`doctor_${doctor._id}_timeslots`);
        if (doctorTimeSlots) {
          const timeSlots = JSON.parse(doctorTimeSlots);
          const startTime = timeSlots.startTime.split(':');
          const endTime = timeSlots.endTime.split(':');
          const startInMinutes = parseInt(startTime[0]) * 60 + parseInt(startTime[1]);
          const endInMinutes = parseInt(endTime[0]) * 60 + parseInt(endTime[1]);
          
          return searchTimeInMinutes >= startInMinutes && searchTimeInMinutes < endInMinutes;
        }
        
        // Default availability 9 AM to 5 PM
        return searchTimeInMinutes >= 540 && searchTimeInMinutes < 1020; // 9*60 to 17*60
      });
      
      // Format filtered doctors for display
      const formattedDoctors = filtered.map(doctor => ({
        id: doctor._id,
        name: doctor.userId?.name || 'Unknown Doctor',
        specialization: doctor.specialization,
        rating: doctor.rating || 4.5,
        consultationFee: doctor.consultationFee || 500,
        availableTime: searchParams.time,
        isAvailable: true,
        nextSlot: searchParams.time
      }));

      setAvailableDoctors(formattedDoctors);
      setSearching(false);
    }, 1000);
  };

  const bookWithDoctor = (doctor) => {
    alert(`Booking appointment with ${doctor.name} at ${searchParams.time} for ${searchParams.specialization}`);
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <AccessTime color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">
            🔍 Find Available Doctors by Time & Specialization
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <TextField
              label="Select Date"
              type="date"
              value={searchParams.date}
              onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <TextField
              label="Preferred Time"
              type="time"
              value={searchParams.time}
              onChange={(e) => setSearchParams({ ...searchParams, time: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Specialization</InputLabel>
              <Select
                value={searchParams.specialization}
                onChange={(e) => setSearchParams({ ...searchParams, specialization: e.target.value })}
                label="Specialization"
              >
                {specializations.map((spec) => (
                  <MenuItem key={spec} value={spec}>{spec}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Search />}
              onClick={searchAvailableDoctors}
              disabled={searching}
              sx={{ height: '56px' }}
            >
              {searching ? 'Searching...' : 'Search'}
            </Button>
          </Grid>
        </Grid>

        {availableDoctors.length > 0 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              📋 Available Doctors on {searchParams.date} at {searchParams.time}
            </Typography>
            
            <List>
              {availableDoctors.map((doctor) => (
                <ListItem key={doctor.id} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocalHospital color="primary" />
                          <Typography variant="h6">{doctor.name}</Typography>
                          <Chip label="Available" color="success" size="small" />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2">
                            🏥 {doctor.specialization} | ⭐ {doctor.rating}/5 | 💰 ₹{doctor.consultationFee}
                          </Typography>
                          <Typography variant="body2" color="success.main">
                            🕐 Available at {doctor.nextSlot} today
                          </Typography>
                        </Box>
                      }
                    />
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => bookWithDoctor(doctor)}
                    sx={{ ml: 2 }}
                  >
                    📅 Book Now
                  </Button>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {availableDoctors.length === 0 && searchParams.time && searchParams.specialization && !searching && (
          <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'warning.light', borderRadius: 1 }}>
            <Typography variant="h6" color="warning.contrastText">
              😔 No doctors available
            </Typography>
            <Typography variant="body2" color="warning.contrastText">
              No {searchParams.specialization} doctors are available at {searchParams.time} on {searchParams.date}.
              Try a different time or specialization.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default DoctorAvailabilityChecker;