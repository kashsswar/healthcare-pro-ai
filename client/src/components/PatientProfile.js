import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, TextField, Button, 
  Box, Grid, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Person, Save, Edit } from '@mui/icons-material';

function PatientProfile({ user, onUpdate }) {
  const [profile, setProfile] = useState({
    age: '',
    dateOfBirth: '',
    gender: '',
    phone: user.phone || '',
    address: ''
  });
  const [editOpen, setEditOpen] = useState(false);
  const [tempProfile, setTempProfile] = useState({});

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

  const openEditDialog = () => {
    setTempProfile({ ...profile });
    setEditOpen(true);
  };

  const saveProfile = () => {
    setProfile(tempProfile);
    localStorage.setItem(`patient_${user._id}_profile`, JSON.stringify(tempProfile));
    if (onUpdate) onUpdate(tempProfile);
    setEditOpen(false);
    alert('Profile updated successfully!');
  };

  const handleTempDOBChange = (dob) => {
    const age = calculateAge(dob);
    setTempProfile(prev => ({
      ...prev,
      dateOfBirth: dob,
      age: age
    }));
  };

  return (
    <>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Person color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">👤 Patient Profile</Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={openEditDialog}
            >
              Edit Profile
            </Button>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary">Date of Birth</Typography>
              <Typography variant="body1">{profile.dateOfBirth || 'Not set'}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary">Age</Typography>
              <Typography variant="body1">{profile.age || 'Not set'}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary">Gender</Typography>
              <Typography variant="body1">{profile.gender || 'Not set'}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary">Phone Number</Typography>
              <Typography variant="body1">{profile.phone || 'Not set'}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">Address</Typography>
              <Typography variant="body1">{profile.address || 'Not set'}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Patient Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={tempProfile.dateOfBirth || ''}
                onChange={(e) => handleTempDOBChange(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Age"
                value={tempProfile.age || ''}
                InputProps={{ readOnly: true }}
                helperText="Auto-calculated from date of birth"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={tempProfile.gender || ''}
                  onChange={(e) => setTempProfile(prev => ({ ...prev, gender: e.target.value }))}
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
                value={tempProfile.phone || ''}
                onChange={(e) => setTempProfile(prev => ({ ...prev, phone: e.target.value }))}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={2}
                value={tempProfile.address || ''}
                onChange={(e) => setTempProfile(prev => ({ ...prev, address: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" startIcon={<Save />} onClick={saveProfile}>
            Save Profile
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default PatientProfile;