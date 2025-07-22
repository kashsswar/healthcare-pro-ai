import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, TextField, Button, 
  Box, Grid, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Chip
} from '@mui/material';
import { LocalHospital, Save, Edit } from '@mui/icons-material';

function DoctorProfile({ user, onUpdate }) {
  const [profile, setProfile] = useState({
    specialization: '',
    experience: '',
    qualification: [],
    consultationFee: '',
    phone: user.phone || '',
    address: '',
    bio: ''
  });
  const [editOpen, setEditOpen] = useState(false);
  const [tempProfile, setTempProfile] = useState({});

  useEffect(() => {
    const savedProfile = localStorage.getItem(`doctor_${user._id}_profile`);
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, [user._id]);

  const openEditDialog = () => {
    setTempProfile({ ...profile });
    setEditOpen(true);
  };

  const saveProfile = () => {
    setProfile(tempProfile);
    localStorage.setItem(`doctor_${user._id}_profile`, JSON.stringify(tempProfile));
    if (onUpdate) onUpdate(tempProfile);
    setEditOpen(false);
    alert('Profile updated successfully!');
  };

  const addQualification = (qual) => {
    if (qual && !tempProfile.qualification?.includes(qual)) {
      setTempProfile(prev => ({
        ...prev,
        qualification: [...(prev.qualification || []), qual]
      }));
    }
  };

  const removeQualification = (qual) => {
    setTempProfile(prev => ({
      ...prev,
      qualification: prev.qualification?.filter(q => q !== qual) || []
    }));
  };

  return (
    <>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalHospital color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">👨‍⚕️ Doctor Profile</Typography>
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
              <Typography variant="body2" color="textSecondary">Specialization</Typography>
              <Typography variant="body1">{profile.specialization || 'Not set'}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary">Experience</Typography>
              <Typography variant="body1">{profile.experience ? `${profile.experience} years` : 'Not set'}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary">Consultation Fee</Typography>
              <Typography variant="body1">{profile.consultationFee ? `₹${profile.consultationFee}` : 'Not set'}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary">Phone Number</Typography>
              <Typography variant="body1">{profile.phone || 'Not set'}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">Qualifications</Typography>
              <Box sx={{ mt: 1 }}>
                {profile.qualification?.length > 0 ? (
                  profile.qualification.map((qual, index) => (
                    <Chip key={index} label={qual} sx={{ mr: 1, mb: 1 }} />
                  ))
                ) : (
                  <Typography variant="body1">Not set</Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">Address</Typography>
              <Typography variant="body1">{profile.address || 'Not set'}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">Bio</Typography>
              <Typography variant="body1">{profile.bio || 'Not set'}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Doctor Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ '& .MuiInputBase-root': { cursor: 'pointer' } }}>
                <InputLabel>Specialization</InputLabel>
                <Select
                  value={tempProfile.specialization || ''}
                  onChange={(e) => setTempProfile(prev => ({ ...prev, specialization: e.target.value }))}
                  label="Specialization"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        overflow: 'auto'
                      }
                    }
                  }}
                >
                  <MenuItem value="General Medicine">General Medicine</MenuItem>
                  <MenuItem value="Cardiology">Cardiology</MenuItem>
                  <MenuItem value="Dermatology">Dermatology</MenuItem>
                  <MenuItem value="Pediatrics">Pediatrics</MenuItem>
                  <MenuItem value="Orthopedics">Orthopedics</MenuItem>
                  <MenuItem value="Gynecology">Gynecology</MenuItem>
                  <MenuItem value="Neurology">Neurology</MenuItem>
                  <MenuItem value="Dentistry">Dentistry</MenuItem>
                  <MenuItem disabled sx={{ justifyContent: 'center', bgcolor: 'primary.main', color: 'white' }}>
                    <Button 
                      size="small" 
                      variant="contained" 
                      onClick={() => document.activeElement.blur()}
                      sx={{ minWidth: '60px' }}
                    >
                      OK
                    </Button>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Experience (years)"
                type="number"
                value={tempProfile.experience || ''}
                onChange={(e) => setTempProfile(prev => ({ ...prev, experience: e.target.value }))}
                sx={{ 
                  '& .MuiInputBase-root': { cursor: 'text' },
                  '& .MuiInputBase-input': { cursor: 'text' },
                  '& input': { cursor: 'text !important' }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Consultation Fee (₹)"
                type="number"
                value={tempProfile.consultationFee || ''}
                onChange={(e) => setTempProfile(prev => ({ ...prev, consultationFee: e.target.value }))}
                sx={{ 
                  '& .MuiInputBase-root': { cursor: 'text' },
                  '& .MuiInputBase-input': { cursor: 'text' },
                  '& input': { cursor: 'text !important' }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={tempProfile.phone || ''}
                onChange={(e) => setTempProfile(prev => ({ ...prev, phone: e.target.value }))}
                sx={{ 
                  '& .MuiInputBase-root': { cursor: 'text' },
                  '& .MuiInputBase-input': { cursor: 'text' },
                  '& input': { cursor: 'text !important' }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Add Qualification"
                placeholder="e.g., MBBS, MD, MS"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addQualification(e.target.value);
                    e.target.value = '';
                  }
                }}
                helperText="Press Enter to add qualification"
                sx={{ 
                  '& .MuiInputBase-root': { cursor: 'text' },
                  '& .MuiInputBase-input': { cursor: 'text' },
                  '& input': { cursor: 'text !important' }
                }}
              />
              <Box sx={{ mt: 1 }}>
                {tempProfile.qualification?.map((qual, index) => (
                  <Chip 
                    key={index} 
                    label={qual} 
                    onDelete={() => removeQualification(qual)}
                    sx={{ mr: 1, mb: 1 }} 
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={2}
                value={tempProfile.address || ''}
                onChange={(e) => setTempProfile(prev => ({ ...prev, address: e.target.value }))}
                sx={{ 
                  '& .MuiInputBase-root': { cursor: 'text' },
                  '& .MuiInputBase-input': { cursor: 'text' },
                  '& textarea': { cursor: 'text !important' }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                multiline
                rows={3}
                value={tempProfile.bio || ''}
                onChange={(e) => setTempProfile(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell patients about yourself, your expertise, and approach to healthcare..."
                sx={{ 
                  '& .MuiInputBase-root': { cursor: 'text' },
                  '& .MuiInputBase-input': { cursor: 'text' },
                  '& textarea': { cursor: 'text !important' }
                }}
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