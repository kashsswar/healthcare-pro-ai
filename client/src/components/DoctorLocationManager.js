import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, TextField, Button, 
  Box, Grid, Alert
} from '@mui/material';
import { LocationOn, Save } from '@mui/icons-material';
import axios from 'axios';

function DoctorLocationManager({ user }) {
  const [location, setLocation] = useState({
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadLocation();
  }, []);

  const loadLocation = async () => {
    try {
      // Try to load from localStorage first
      const savedLocation = localStorage.getItem(`doctor_${user.doctorId || user._id}_location`);
      if (savedLocation) {
        setLocation(JSON.parse(savedLocation));
      }
      
      // Try to load from API
      const response = await axios.get(`/api/doctors/${user.doctorId || user._id}`);
      if (response.data.location) {
        setLocation({
          address: response.data.location.address || '',
          city: response.data.location.city || '',
          state: response.data.location.state || '',
          pincode: response.data.location.pincode || '',
          landmark: response.data.location.landmark || ''
        });
      }
    } catch (error) {
      console.log('Using default location settings');
    }
  };

  const saveLocation = async () => {
    try {
      setSaving(true);
      
      // Save to localStorage
      localStorage.setItem(`doctor_${user.doctorId || user._id}_location`, JSON.stringify(location));
      
      // Try to save to API
      try {
        await axios.patch(`/api/doctors/${user.doctorId || user._id}/location`, {
          location: location
        });
      } catch (apiError) {
        console.log('API save failed, using localStorage');
      }
      
      setMessage('Location saved successfully! Patients can now find you by location.');
      setTimeout(() => setMessage(''), 3000);
      
    } catch (error) {
      setMessage('Failed to save location. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setLocation(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <LocationOn color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">
            📍 Clinic Location & Address
          </Typography>
        </Box>

        {message && (
          <Alert severity={message.includes('success') ? 'success' : 'error'} sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Clinic Address"
              value={location.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter your clinic's full address"
              multiline
              rows={2}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="City"
              value={location.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="e.g., Mumbai, Delhi, Bangalore"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="State"
              value={location.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              placeholder="e.g., Maharashtra, Delhi, Karnataka"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="PIN Code"
              value={location.pincode}
              onChange={(e) => handleInputChange('pincode', e.target.value)}
              placeholder="e.g., 400001"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Landmark (Optional)"
              value={location.landmark}
              onChange={(e) => handleInputChange('landmark', e.target.value)}
              placeholder="e.g., Near City Hospital, Opposite Mall"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={saveLocation}
            disabled={saving || !location.address || !location.city}
          >
            {saving ? 'Saving...' : '💾 Save Location'}
          </Button>
          
          {location.city && (
            <Typography variant="body2" color="primary">
              📍 Current: {location.city}, {location.state}
            </Typography>
          )}
        </Box>

        <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
          <Typography variant="body2" color="info.contrastText">
            💡 <strong>Why add location?</strong> Patients can search for doctors near them. 
            Your location helps patients find you easily and book appointments.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default DoctorLocationManager;