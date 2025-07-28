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
      const userId = user.doctorId || user._id || user.id;
      if (!userId) return;
      
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/api/doctor-location/${userId}`);
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          const locationData = {
            address: data.location.address || '',
            city: data.location.city || '',
            state: data.location.state || '',
            pincode: '',
            landmark: ''
          };
          setLocation(locationData);
          setHasLocation(locationData.address && locationData.city);
        } else {
          console.log('Location API returned non-JSON response');
        }
      } else {
        console.log('Location API response not ok');
      }
    } catch (error) {
      console.log('Error loading location:', error);
    }
  };

  const saveLocation = async () => {
    try {
      setSaving(true);
      
      const userId = user.doctorId || user._id || user.id;
      if (!userId) return;
      
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/api/doctor-location/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: location.city,
          state: location.state,
          address: location.address
        })
      });
      
      if (response.ok) {
        setMessage('Location saved successfully! Patients can now find you by location.');
        setHasLocation(true);
        setIsEditing(false);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to save location. Please try again.');
      }
      
    } catch (error) {
      console.error('Error saving location:', error);
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