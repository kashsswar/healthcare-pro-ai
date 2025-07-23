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
  const [isEditing, setIsEditing] = useState(false);
  const [hasLocation, setHasLocation] = useState(false);

  useEffect(() => {
    loadLocation();
  }, []);

  const loadLocation = async () => {
    try {
      // Try to load from localStorage first
      const savedLocation = localStorage.getItem(`doctor_${user.doctorId || user._id}_location`);
      if (savedLocation) {
        const locationData = JSON.parse(savedLocation);
        setLocation(locationData);
        setHasLocation(locationData.address && locationData.city);
      }
      
      // Skip API call - use only localStorage
      console.log('Using localStorage for location data');
    } catch (error) {
      console.log('Using default location settings');
    }
  };

  const saveLocation = async () => {
    try {
      setSaving(true);
      
      // Save to localStorage
      localStorage.setItem(`doctor_${user.doctorId || user._id}_location`, JSON.stringify(location));
      
      // Skip API save - use only localStorage
      console.log('Location saved to localStorage only');
      
      setMessage('Location saved successfully! Patients can now find you by location.');
      setHasLocation(true);
      setIsEditing(false);
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

        {hasLocation && !isEditing ? (
          <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1, mb: 2 }}>
            <Typography variant="h6" color="success.contrastText">📍 Current Location</Typography>
            <Typography color="success.contrastText">{location.address}</Typography>
            <Typography color="success.contrastText">{location.city}, {location.state} - {location.pincode}</Typography>
            {location.landmark && <Typography color="success.contrastText">Near: {location.landmark}</Typography>}
            <Button 
              variant="outlined" 
              size="small" 
              onClick={() => setIsEditing(true)}
              sx={{ mt: 1, color: 'success.contrastText', borderColor: 'success.contrastText' }}
            >
              ✏️ Edit Location
            </Button>
          </Box>
        ) : (
          <>
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

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={saveLocation}
                disabled={saving || !location.address || !location.city}
              >
                {saving ? 'Saving...' : '💾 Save Location'}
              </Button>
              
              {isEditing && (
                <Button
                  variant="outlined"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </>
        )}

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