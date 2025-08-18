import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, TextField, Button, 
  Box, Grid, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Person, Save, Edit, AccountBalance } from '@mui/icons-material';
import PatientReviewHistory from './PatientReviewHistory';
import PatientBankSetup from './PatientBankSetup';

function PatientProfile({ user, onUpdate }) {
  const [profile, setProfile] = useState({
    age: '',
    dateOfBirth: '',
    gender: '',
    phone: user.phone || '',
    flatNo: '',
    street: '',
    city: '',
    state: ''
  });
  const [editOpen, setEditOpen] = useState(false);
  const [tempProfile, setTempProfile] = useState({});
  const [bankSetupOpen, setBankSetupOpen] = useState(false);
  const [bankDetails, setBankDetails] = useState(null);

  useEffect(() => {
    const userId = user._id || user.id;
    if (userId) {
      loadProfile();
      loadBankDetails();
    }
    
    // Listen for bank details updates
    const handleBankUpdate = () => {
      loadBankDetails();
    };
    window.addEventListener('bankDetailsUpdated', handleBankUpdate);
    
    return () => {
      window.removeEventListener('bankDetailsUpdated', handleBankUpdate);
    };
  }, [user._id, user.id]);
  
  const loadBankDetails = async () => {
    try {
      const userId = user._id || user.id;
      if (!userId) return;
      
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      console.log('Loading bank details for user:', userId);
      const response = await fetch(`${apiUrl}/api/bank-details/patient/${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Bank details response:', data);
        setBankDetails(data && data.accountNumber ? data : null);
      } else {
        console.log('Bank details API failed:', response.status);
        setBankDetails(null);
      }
    } catch (error) {
      console.error('Error loading bank details:', error);
      setBankDetails(null);
    }
  };
  
  const loadProfile = async () => {
    try {
      const userId = user._id || user.id;
      if (!userId) return;
      
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/patient-profile/${userId}`);
      if (response.ok) {
        const patientData = await response.json();
        console.log('Loaded patient data:', patientData);
        console.log('Profile object:', patientData.profile);
        console.log('Address fields:', {
          flatNo: patientData.profile?.flatNo,
          street: patientData.profile?.street,
          city: patientData.profile?.city,
          state: patientData.profile?.state,
          dateOfBirth: patientData.profile?.dateOfBirth
        });
        const newProfile = {
          name: patientData.name || user.name || '',
          phone: patientData.phone || user.phone || '',
          age: patientData.profile?.age || '',
          dateOfBirth: patientData.profile?.dateOfBirth || '',
          gender: patientData.profile?.gender || '',
          flatNo: patientData.profile?.flatNo || '',
          street: patientData.profile?.street || '',
          city: patientData.profile?.city || '',
          state: patientData.profile?.state || '',
          medicalHistory: patientData.profile?.medicalHistory?.join(', ') || ''
        };
        console.log('Setting profile to:', newProfile);
        setProfile(newProfile);
      } else {
        setProfile({
          name: user.name || '',
          phone: user.phone || '',
          age: '',
          dateOfBirth: '',
          gender: '',
          flatNo: '',
          street: '',
          city: '',
          state: '',
          medicalHistory: ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

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

  const saveProfile = async () => {
    try {
      const userId = user._id || user.id;
      if (!userId) return;
      
      console.log('Saving profile data:', tempProfile);
      
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/patient-profile/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tempProfile)
      });
      
      if (response.ok) {
        const savedData = await response.json();
        console.log('Profile saved successfully:', savedData);
        setProfile(tempProfile);
        setEditOpen(false);
        alert('Profile updated successfully!');
        loadProfile(); // Reload from API
      } else {
        const errorText = await response.text();
        console.error('Save failed:', errorText);
        alert('Failed to save profile. Please try again.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
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

          <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
            <Typography variant="body1" color="success.contrastText">
              <strong>📅 DOB:</strong> {profile.dateOfBirth || 'Not set'} {profile.age ? `(Age: ${profile.age})` : ''}
            </Typography>
            <Typography variant="body1" color="success.contrastText">
              <strong>👤 Gender:</strong> {profile.gender || 'Not set'}
            </Typography>
            <Typography variant="body1" color="success.contrastText">
              <strong>📱 Phone:</strong> {profile.phone || 'Not set'}
            </Typography>
            <Typography variant="body1" color="success.contrastText">
              <strong>🏠 Address:</strong> {[profile.flatNo, profile.street, profile.city, profile.state].filter(Boolean).join(', ') || 'Not set'}
            </Typography>
          </Box>
          
          {!(profile.dateOfBirth || profile.gender || profile.city) && (
            <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1, mt: 2 }}>
              <Typography variant="body1" color="info.contrastText">
                📝 Please complete your profile by clicking "Edit Profile" above.
              </Typography>
            </Box>
          )}

        </CardContent>
      </Card>

      {/* Bank Account Setup */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccountBalance color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">🏦 Bank Account</Typography>
            </Box>
            <Button
              variant={bankDetails ? "outlined" : "contained"}
              startIcon={<Edit />}
              onClick={() => setBankSetupOpen(true)}
            >
              {bankDetails ? 'Update Account' : 'Setup Account'}
            </Button>
          </Box>

          {bankDetails ? (
            <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
              <Typography variant="body1" color="success.contrastText">
                <strong>🏦 Bank:</strong> {bankDetails.bankName}
              </Typography>
              <Typography variant="body1" color="success.contrastText">
                <strong>👤 Account Holder:</strong> {bankDetails.accountHolderName}
              </Typography>
              <Typography variant="body1" color="success.contrastText">
                <strong>🔢 Account:</strong> ****{bankDetails.accountNumber?.slice(-4)}
              </Typography>
              <Typography variant="body1" color="success.contrastText">
                <strong>🏛️ IFSC:</strong> {bankDetails.ifscCode}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
              <Typography variant="body1" color="warning.contrastText">
                ⚠️ No bank account setup. Add your account for refunds and withdrawals.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Patient Review History */}
      <PatientReviewHistory patientId={user._id || user.id} />

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
                sx={{ 
                  cursor: 'pointer',
                  '& .MuiInputBase-root': { cursor: 'pointer' },
                  '& input': { cursor: 'pointer' }
                }}
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
              <FormControl fullWidth sx={{ cursor: 'pointer' }}>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={tempProfile.gender || ''}
                  onChange={(e) => setTempProfile(prev => ({ ...prev, gender: e.target.value }))}
                  label="Gender"
                  sx={{ cursor: 'pointer' }}
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
                sx={{ cursor: 'pointer' }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Flat/House No"
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
      
      {/* Bank Setup Dialog */}
      <PatientBankSetup
        open={bankSetupOpen}
        onClose={() => {
          setBankSetupOpen(false);
          // Add a small delay to ensure data is saved before refreshing
          setTimeout(() => {
            loadBankDetails();
          }, 500);
        }}
        patient={user}
      />
    </>
  );
}

export default PatientProfile;