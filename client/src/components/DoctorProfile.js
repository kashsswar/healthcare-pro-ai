import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, TextField, Button, 
  Box, Grid, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Person, Save, Edit } from '@mui/icons-material';
import ReviewsList from './ReviewsList';

function DoctorProfile({ user, onUpdate }) {
  
  const [rating, setRating] = useState('4.5');
  const [adminBoost, setAdminBoost] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [bankDetails, setBankDetails] = useState(null);
  
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
    const userId = user._id || user.id;
    console.log('=== DOCTOR PROFILE LOADING ===');
    console.log('User object:', user);
    console.log('User._id:', user._id);
    console.log('User.id:', user.id);
    console.log('Using userId:', userId);
    if (userId) {
      loadProfile();
      loadStats();
      loadBankDetails();
    }
  }, [user._id, user.id]);
  
  const loadProfile = async () => {
    try {
      const userId = user._id || user.id;
      if (!userId) return;
      
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/api/doctor-profile/${userId}`);
      if (response.ok) {
        const doctorData = await response.json();
        setProfile({
          specialization: doctorData.specialization || '',
          experience: doctorData.experience?.toString() || '',
          consultationFee: doctorData.consultationFee?.toString() || '',
          qualification: doctorData.qualification?.join(', ') || '',
          flatNo: doctorData.location?.address || '',
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
      const userId = user._id || user.id;
      if (!userId) return;
      
      // Load appointments for patient count
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/appointments/doctor/${userId}`);
      if (response.ok) {
        const appointments = await response.json();
        
        // Calculate total bookings minus cancelled
        const totalBookings = appointments.length;
        const cancelledBookings = appointments.filter(apt => apt.status === 'cancelled').length;
        const patientsTreated = totalBookings - cancelledBookings;
        
        setPatientCount(patientsTreated);
      }
      
      // Load reviews from API
      const reviewResponse = await fetch(`${apiUrl}/api/reviews/doctor/${userId}/stats`);
      if (reviewResponse.ok) {
        const reviewStats = await reviewResponse.json();
        setReviewCount(reviewStats.reviewCount);
        if (reviewStats.averageRating > 0) {
          setRating(reviewStats.averageRating.toFixed(1));
        }
      }
      
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };
  
  const loadBankDetails = async () => {
    try {
      const userId = user._id || user.id;
      if (!userId) return;
      
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/bank-details/doctor/${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.accountNumber) {
          setBankDetails(data);
        }
      }
    } catch (error) {
      console.error('Error loading bank details:', error);
    }
  };
  


  const openEditDialog = () => {
    setTempProfile({ ...profile });
    setEditOpen(true);
  };

  const saveProfile = async () => {
    try {
      const userId = user._id || user.id;
      if (!userId) return;
      
      const apiUrl = process.env.REACT_APP_API_URL;
      
      // Save profile data
      const profileResponse = await fetch(`${apiUrl}/api/doctor-profile/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tempProfile)
      });
      
      // Save location data separately
      const locationResponse = await fetch(`${apiUrl}/api/doctor-location/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: tempProfile.city,
          state: tempProfile.state,
          address: tempProfile.flatNo
        })
      });
      
      if (profileResponse.ok && locationResponse.ok) {
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
              {bankDetails && (
                <Typography variant="body1" color="success.contrastText">
                  <strong>🏦 Bank Details:</strong> {bankDetails.bankName} - ****{bankDetails.accountNumber.slice(-4)}
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

      {/* Reviews List */}
      <ReviewsList doctorId={user._id || user.id} userRole="doctor" />

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