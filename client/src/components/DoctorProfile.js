import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, TextField, Button, 
  Box, Grid, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Person, Save, Edit } from '@mui/icons-material';

function DoctorProfile({ user, onUpdate }) {
  
  const getRating = () => {
    const reviews = JSON.parse(localStorage.getItem('doctorReviews') || '[]');
    const doctorReviews = reviews.filter(review => review.doctorId === user._id);
    
    if (doctorReviews.length === 0) {
      return '4.5';
    }
    
    const avgRating = doctorReviews.reduce((sum, review) => sum + review.rating, 0) / doctorReviews.length;
    const adminBoost = getAdminBoost();
    
    return Math.min(5.0, avgRating + adminBoost).toFixed(1);
  };
  
  const getAdminBoost = () => {
    const adminBoosts = JSON.parse(localStorage.getItem('adminRatingBoosts') || '[]');
    const doctorBoosts = JSON.parse(localStorage.getItem('doctorBoosts') || '[]');
    const ratingBoosts = JSON.parse(localStorage.getItem('ratingBoosts') || '[]');
    
    let boost = adminBoosts.find(b => b.doctorId === user._id) || 
               doctorBoosts.find(b => b.doctorId === user._id) || 
               ratingBoosts.find(b => b.doctorId === user._id);
    
    return boost ? (boost.boostAmount || boost.rating || boost.boost || 0) : 0;
  };
  
  const getReviewCount = () => {
    const reviews = JSON.parse(localStorage.getItem('doctorReviews') || '[]');
    const doctorReviews = reviews.filter(review => review.doctorId === user._id);
    return doctorReviews.length;
  };
  
  const getPatientCount = () => {
    const appointments = JSON.parse(localStorage.getItem('bookedAppointments') || '[]');
    const doctorAppointments = appointments.filter(apt => 
      (apt.doctorId === user._id || apt.doctor === user._id) && 
      apt.status === 'completed'
    );
    return doctorAppointments.length;
  };
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
    const savedProfile = localStorage.getItem(`doctor_${user._id}_profile`);
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      console.log('Loading doctor profile:', parsedProfile);
      setProfile(parsedProfile);
    } else {
      console.log('No saved profile found for doctor:', user._id);
      // Clear any existing profile data
      setProfile({
        specialization: '',
        experience: '',
        consultationFee: '',
        qualification: '',
        flatNo: '',
        street: '',
        city: '',
        state: '',
        phone: user.phone || '',
        name: user.name || ''
      });
    }
  }, [user._id]);

  const openEditDialog = () => {
    setTempProfile({ ...profile });
    setEditOpen(true);
  };

  const saveProfile = () => {
    setProfile(tempProfile);
    localStorage.setItem(`doctor_${user._id}_profile`, JSON.stringify(tempProfile));
    
    // Trigger multiple events for other components to refresh
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('doctorProfileUpdated', { 
      detail: { doctorId: user._id, city: tempProfile.city } 
    }));
    
    console.log('Doctor profile saved:', tempProfile);
    console.log('Events dispatched for profile update');
    
    if (onUpdate) onUpdate(tempProfile);
    setEditOpen(false);
    alert('Doctor profile updated successfully! Patients can now find you in ' + tempProfile.city);
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