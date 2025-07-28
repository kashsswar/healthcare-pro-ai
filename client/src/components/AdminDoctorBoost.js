import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, Select, MenuItem, 
  FormControl, InputLabel, Chip, Box, Switch, FormControlLabel, InputAdornment
} from '@mui/material';
import { Star, TrendingUp, PushPin, Search } from '@mui/icons-material';

function AdminDoctorBoost() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [boostDialog, setBoostDialog] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [boostType, setBoostType] = useState('rating');
  const [boostValue, setBoostValue] = useState(0.5);

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [searchTerm, doctors]);

  const filterDoctors = () => {
    if (!searchTerm) {
      setFilteredDoctors(doctors);
      return;
    }
    
    const filtered = doctors.filter(doctor => 
      doctor.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.location?.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(filtered);
  };

  const loadDoctors = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/doctors`);
      const data = await response.json();
      setDoctors(data);
      setFilteredDoctors(data);
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
  };

  const handleBoost = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/boost-doctor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: selectedDoctor._id,
          adminId: '507f1f77bcf86cd799439011',
          boostType,
          customRating: boostType === 'rating' ? parseFloat(boostValue) : null,
          boostValue: parseFloat(boostValue)
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        const message = boostType === 'rating' 
          ? `Doctor rating set to ${boostValue}/5.0` 
          : 'Doctor boosted successfully!';
        alert(message);
        setBoostDialog(false);
        loadDoctors();
      } else {
        alert('Failed to boost doctor: ' + result.message);
      }
    } catch (error) {
      console.error('Boost error:', error);
      alert('Failed to boost doctor');
    }
  };

  const toggleFirstPosition = async (doctorId, makeFirst) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/admin/set-first-position`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId,
          makeFirst
        })
      });
      
      alert(makeFirst ? 'Doctor moved to first position!' : 'Doctor removed from first position!');
      loadDoctors();
    } catch (error) {
      alert('Failed to update position');
    }
  };

  const openBoostDialog = (doctor) => {
    setSelectedDoctor(doctor);
    setBoostDialog(true);
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          👑 Admin Doctor Management ({filteredDoctors.length} doctors)
        </Typography>
        
        <TextField
          fullWidth
          placeholder="Search doctors by name, specialization, or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Doctor</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDoctors.map((doctor) => (
                <TableRow key={doctor._id}>
                  <TableCell>
                    <Box>
                      <Typography variant="body1">Dr. {doctor.userId?.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {doctor.specialization}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{doctor.location?.city}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Star color="warning" />
                      <Typography variant="body1">
                        {doctor.finalRating || doctor.rating}
                      </Typography>
                      {doctor.adminBoostRating && (
                        <Chip 
                          label={`+${doctor.adminBoostRating}`} 
                          color="primary" 
                          size="small" 
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={doctor.isOnline ? 'Online' : 'Offline'} 
                      color={doctor.isOnline ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={doctor.isFirstPosition || false}
                          onChange={(e) => toggleFirstPosition(doctor._id, e.target.checked)}
                          size="small"
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PushPin sx={{ fontSize: 16, mr: 0.5 }} />
                          First
                        </Box>
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="contained" 
                      size="small"
                      onClick={() => openBoostDialog(doctor)}
                      startIcon={<TrendingUp />}
                    >
                      Boost
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      <Dialog open={boostDialog} onClose={() => setBoostDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          🚀 Boost Dr. {selectedDoctor?.userId?.name}
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Boost Type</InputLabel>
              <Select
                value={boostType}
                onChange={(e) => setBoostType(e.target.value)}
              >
                <MenuItem value="rating">⭐ Rating Boost</MenuItem>
                <MenuItem value="featured">🌟 Featured Doctor</MenuItem>
                <MenuItem value="visibility">👁️ Visibility Boost</MenuItem>
              </Select>
            </FormControl>

            {boostType === 'rating' && (
              <Box>
                <TextField
                  fullWidth
                  label="Set Exact Rating (1.0 to 5.0)"
                  type="number"
                  value={boostValue}
                  onChange={(e) => setBoostValue(e.target.value)}
                  inputProps={{ min: 1.0, max: 5.0, step: 0.1 }}
                  helperText="Set doctor's exact rating (overrides current rating)"
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {[5.0, 4.8, 4.5, 4.0, 3.5].map(rating => (
                    <Button
                      key={rating}
                      variant="outlined"
                      size="small"
                      onClick={() => setBoostValue(rating)}
                    >
                      {rating} ⭐
                    </Button>
                  ))}
                </Box>
              </Box>
            )}

            <Box sx={{ bgcolor: 'info.light', p: 2, borderRadius: 1 }}>
              <Typography variant="body2">
                💡 <strong>Boost Options:</strong>
                <br />• Rating Boost: Increase rating score
                <br />• Featured: Show at top of search results  
                <br />• Visibility: Appear more in recommendations
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setBoostDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleBoost}
          >
            🚀 Apply Boost
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

export default AdminDoctorBoost;