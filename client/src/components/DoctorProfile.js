import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, TextField, Button, 
  Box, Grid, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Person, Save, Edit } from '@mui/icons-material';

function DoctorProfile({ user, onUpdate }) {
  
  const [rating, setRating] = useState('4.5');
  const [adminBoost, setAdminBoost] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  
  const getRating = () => rating;
  const getAdminBoost = () => adminBoost;
  const getReviewCount = () => reviewCount;
  const getPatientCount = () => patientCount;
  const [profile, setProfile] = useState({
    specialization: user.specialization || '',
    experience: user.experience || '',
    consultationFee: user.consultationFee || '',
    qualification: user.qualification || '',
    flatNo: user.flatNo || '',
    street: user.street || '',
    city: user.city || '',
    state: user.state || '',
    phone: user.phone || '',
    name: user.name || ''
  });
  const [editOpen, setEditOpen] = useState(false);
  const [tempProfile, setTempProfile] = useState({});

  useEffect(() => {
    loadProfile();
    loadStats();
  }, [user._id]);
  
  const loadProfile = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/doctor-profile/${user._id}`);
      if (response.ok) {
        const doctorData = await response.json();
        setProfile({
          specialization: doctorData.specialization || '',
          experience: doctorData.experience?.toString() || '',
          consultationFee: doctorData.consultationFee?.toString() || '',
          qualification: doctorData.qualification?.join(', ') || '',
          flatNo: '',
          street: '',
          city: doctorData.location?.city || '',
          state: doctorData.location?.state || '',
          phone: doctorData.userId?.phone || user.phone || '',
          name: user.name || ''
        });
        setRating((doctorData.rating || 4.5).toFixed(1));
        setAdminBoost(doctorData.adminBoostRating || 0);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };
  
  const loadStats = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/appointments/doctor/${user._id}/stats`);
      if (response.ok) {
        const stats = await response.json();
        setReviewCount(stats.reviewCount || 0);
        setPatientCount(stats.completedAppointments || 0);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };
  


  const openEditDialog = () => {
    setTempProfile({ ...profile });
    setEditOpen(true);
  };

  const saveProfile = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/doctor-profile/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tempProfile)
      });
      
      if (response.ok) {
        setProfile(tempProfile);
        if (onUpdate) onUpdate(tempProfile);
        setEditOpen(false);
        alert('Doctor profile updated successfully! Patients can now find you in ' + tempProfile.city);
      } else {
        alert('Failed to save profile. Please try again.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  return (
    <>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Person color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">👨‍⚕️ Dr. {user.name}</Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={openEditDialog}
            >
              Edit Profile
            </Button>
          </Box>

          {(profile.specialization && profile.specialization.trim()) ? (
            <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
              {profile.specialization && (
                <Typography variant="body1" color="success.contrastText">
                  <strong>🏥 Specialization:</strong> {profile.specialization}
                </Typography>
              )}
              {profile.experience && (
                <Typography variant="body1" color="success.contrastText">
                  <strong>📅 Experience:</strong> {profile.experience} years
                </Typography>
              )}
              {profile.consultationFee && (
                <Typography variant="body1" color="success.contrastText">
                  <strong>💰 Consultation Fee:</strong> ₹{profile.consultationFee}
                </Typography>
              )}
              {profile.qualification && (
                <Typography variant="body1" color="success.contrastText">
                  <strong>🎓 Qualification:</strong> {profile.qualification}
                </Typography>
              )}
              {profile.phone && (
                <Typography variant="body1" color="success.contrastText">
                  <strong>📱 Phone:</strong> {profile.phone}
                </Typography>
              )}
              <Typography variant="body1" color="success.contrastText">
                <strong>⭐ Rating:</strong> {getRating()}/5.0 {getAdminBoost() > 0 && `(+${getAdminBoost()} Admin Boost)`}
              </Typography>
              <Typography variant="body1" color="success.contrastText">
                <strong>📊 Reviews:</strong> {getReviewCount()} patient reviews
              </Typography>
              <Typography variant="body1" color="success.contrastText">
                <strong>👥 Patients Treated:</strong> {getPatientCount()} total patients
              </Typography>
              {(profile.flatNo || profile.street || profile.city || profile.state) && (
                <Typography variant="body1" color="success.contrastText">
                  <strong>🏠 Clinic Address:</strong> {[profile.flatNo, profile.street, profile.city, profile.state].filter(Boolean).join(', ')}
                </Typography>
              )}
            </Box>
          ) : (
            <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
              <Typography variant="body1" color="info.contrastText">
                📝 Please complete your doctor profile by clicking "Edit Profile" above.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Doctor Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ cursor: 'pointer' }}>
                <InputLabel>Specialization</InputLabel>
                <Select
                  value={tempProfile.specialization || ''}
                  onChange={(e) => setTempProfile(prev => ({ ...prev, specialization: e.target.value }))}
                  label="Specialization"
                  sx={{ cursor: 'pointer' }}
                >
                  <MenuItem value="General Medicine">General Medicine</MenuItem>
                  <MenuItem value="Cardiology">Cardiology</MenuItem>
                  <MenuItem value="Dermatology">Dermatology</MenuItem>
                  <MenuItem value="Pediatrics">Pediatrics</MenuItem>
                  <MenuItem value="Orthopedics">Orthopedics</MenuItem>
                  <MenuItem value="Gynecology">Gynecology</MenuItem>
                  <MenuItem value="Neurology">Neurology</MenuItem>
                  <MenuItem value="Psychiatry">Psychiatry</MenuItem>
                  <MenuItem value="Ophthalmology">Ophthalmology</MenuItem>
                  <MenuItem value="ENT">ENT</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Experience (Years)"
                type="number"
                value={tempProfile.experience || ''}
                onChange={(e) => setTempProfile(prev => ({ ...prev, experience: e.target.value }))}
                sx={{ cursor: 'pointer' }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Consultation Fee (₹)"
                type="number"
                value={tempProfile.consultationFee || ''}
                onChange={(e) => setTempProfile(prev => ({ ...prev, consultationFee: e.target.value }))}
                sx={{ cursor: 'pointer' }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Qualification"
                value={tempProfile.qualification || ''}
                onChange={(e) => setTempProfile(prev => ({ ...prev, qualification: e.target.value }))}
                placeholder="e.g., MBBS, MD"
                sx={{ cursor: 'pointer' }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={tempProfile.phone || ''}
                onChange={(e) => setTempProfile(prev => ({ ...prev, phone: e.target.value }))}
                sx={{ cursor: 'pointer' }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Clinic/House No"
                value={tempProfile.flatNo || ''}
                onChange={(e) => setTempProfile(prev => ({ ...prev, flatNo: e.target.value }))}
                sx={{ cursor: 'pointer' }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Street/Area"
                value={tempProfile.street || ''}
                onChange={(e) => setTempProfile(prev => ({ ...prev, street: e.target.value }))}
                sx={{ cursor: 'pointer' }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="City"
                value={tempProfile.city || ''}
                onChange={(e) => setTempProfile(prev => ({ ...prev, city: e.target.value }))}
                sx={{ cursor: 'pointer' }}
                helperText="⚠️ Important: Patients will find you based on this city"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="State"
                value={tempProfile.state || ''}
                onChange={(e) => setTempProfile(prev => ({ ...prev, state: e.target.value }))}
                sx={{ cursor: 'pointer' }}
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

export default DoctorProfile;