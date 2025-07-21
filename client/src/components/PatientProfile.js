import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, TextField, Button, 
  Box, Grid, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Person, Save } from '@mui/icons-material';

function PatientProfile({ user, onUpdate }) {
  const [profile, setProfile] = useState({
    age: '',
    dateOfBirth: '',
    gender: '',
    phone: user.phone || '',
    address: ''
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem(`patient_${user._id}_profile`);
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, [user._id]);

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleDOBChange = (dob) => {
    const age = calculateAge(dob);
    setProfile(prev => ({
      ...prev,
      dateOfBirth: dob,
      age: age
    }));
  };

  const saveProfile = () => {
    localStorage.setItem(`patient_${user._id}_profile`, JSON.stringify(profile));
    if (onUpdate) onUpdate(profile);
    alert('Profile updated successfully!');
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Person color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">👤 Patient Profile</Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date of Birth"
              type="date"
              value={profile.dateOfBirth}
              onChange={(e) => handleDOBChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Age"
              value={profile.age}
              InputProps={{ readOnly: true }}
              helperText="Auto-calculated from date of birth"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={profile.gender}
                onChange={(e) => setProfile(prev => ({ ...prev, gender: e.target.value }))}
                label="Gender"
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={profile.phone}
              onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              multiline
              rows={2}
              value={profile.address}
              onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={saveProfile}
          >
            💾 Save Profile
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default PatientProfile;