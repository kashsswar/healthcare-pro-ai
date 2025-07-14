import React, { useState } from 'react';
import { 
  Card, CardContent, Typography, Switch, FormControlLabel, 
  TextField, Button, Box, Chip, Grid, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { LocationOn, Schedule, Circle } from '@mui/icons-material';

function DoctorAvailability({ doctor }) {
  const [isOnline, setIsOnline] = useState(true);
  const [location, setLocation] = useState(doctor?.location?.city || 'Mumbai');
  const [availability, setAvailability] = useState({
    monday: { available: true, start: '09:00', end: '17:00' },
    tuesday: { available: true, start: '09:00', end: '17:00' },
    wednesday: { available: true, start: '09:00', end: '17:00' },
    thursday: { available: true, start: '09:00', end: '17:00' },
    friday: { available: true, start: '09:00', end: '17:00' },
    saturday: { available: false, start: '09:00', end: '13:00' },
    sunday: { available: false, start: '09:00', end: '13:00' }
  });

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad', 'Kolkata', 'Ahmedabad'];
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const handleSave = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/doctors/availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: doctor._id,
          isOnline,
          location,
          availability
        })
      });
      alert('Availability updated successfully!');
    } catch (error) {
      alert('Failed to update availability');
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Circle 
            sx={{ 
              color: isOnline ? 'success.main' : 'error.main', 
              mr: 1, 
              fontSize: 16 
            }} 
          />
          <Typography variant="h6">
            Doctor Status & Availability
          </Typography>
        </Box>

        {/* Online/Offline Toggle */}
        <FormControlLabel
          control={
            <Switch
              checked={isOnline}
              onChange={(e) => setIsOnline(e.target.checked)}
              color="success"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1">
                {isOnline ? '🟢 Online - Available for consultations' : '🔴 Offline - Not accepting patients'}
              </Typography>
            </Box>
          }
          sx={{ mb: 3 }}
        />

        {/* Location */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
            Current Location
          </Typography>
          <FormControl fullWidth>
            <InputLabel>City</InputLabel>
            <Select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              label="City"
            >
              {cities.map(city => (
                <MenuItem key={city} value={city}>{city}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Weekly Schedule */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            <Schedule sx={{ mr: 1, verticalAlign: 'middle' }} />
            Weekly Schedule
          </Typography>
          
          <Grid container spacing={2}>
            {days.map(day => (
              <Grid item xs={12} key={day}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={availability[day].available}
                        onChange={(e) => setAvailability({
                          ...availability,
                          [day]: { ...availability[day], available: e.target.checked }
                        })}
                        size="small"
                      />
                    }
                    label={day.charAt(0).toUpperCase() + day.slice(1)}
                    sx={{ minWidth: 120 }}
                  />
                  
                  {availability[day].available && (
                    <>
                      <TextField
                        type="time"
                        label="Start"
                        value={availability[day].start}
                        onChange={(e) => setAvailability({
                          ...availability,
                          [day]: { ...availability[day], start: e.target.value }
                        })}
                        size="small"
                        sx={{ width: 120 }}
                      />
                      <TextField
                        type="time"
                        label="End"
                        value={availability[day].end}
                        onChange={(e) => setAvailability({
                          ...availability,
                          [day]: { ...availability[day], end: e.target.value }
                        })}
                        size="small"
                        sx={{ width: 120 }}
                      />
                    </>
                  )}
                  
                  {!availability[day].available && (
                    <Chip label="Not Available" color="default" size="small" />
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Button 
          variant="contained" 
          onClick={handleSave}
          fullWidth
          size="large"
        >
          💾 Save Availability Settings
        </Button>
      </CardContent>
    </Card>
  );
}

export default DoctorAvailability;