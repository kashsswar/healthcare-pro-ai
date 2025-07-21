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
    
    // Simulate API call - replace with real API
    setTimeout(() => {
      const mockDoctors = [
        {
          id: 1,
          name: 'Dr. Sarah Johnson',
          specialization: searchParams.specialization,
          rating: 4.8,
          consultationFee: 500,
          availableTime: searchParams.time,
          isAvailable: true,
          nextSlot: searchParams.time
        },
        {
          id: 2,
          name: 'Dr. Michael Chen',
          specialization: searchParams.specialization,
          rating: 4.6,
          consultationFee: 600,
          availableTime: searchParams.time,
          isAvailable: true,
          nextSlot: searchParams.time
        },
        {
          id: 3,
          name: 'Dr. Priya Sharma',
          specialization: searchParams.specialization,
          rating: 4.9,
          consultationFee: 450,
          availableTime: searchParams.time,
          isAvailable: true,
          nextSlot: searchParams.time
        }
      ];

      // Filter based on time (simulate doctor availability)
      const timeHour = parseInt(searchParams.time.split(':')[0]);
      const filtered = mockDoctors.filter(doctor => {
        // Simulate different doctors available at different times
        const doctorStartHour = 9 + (doctor.id - 1) * 2; // 9, 11, 13
        const doctorEndHour = doctorStartHour + 8; // 17, 19, 21
        return timeHour >= doctorStartHour && timeHour < doctorEndHour;
      });

      setAvailableDoctors(filtered);
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