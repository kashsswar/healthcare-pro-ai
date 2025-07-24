import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material';
import axios from 'axios';

const AdminRatingBoost = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [boostValue, setBoostValue] = useState(0);
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('/api/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleBoost = async () => {
    try {
      const adminId = localStorage.getItem('userId'); // Assuming admin ID is stored
      
      // Save boost to localStorage for offline functionality
      const boosts = JSON.parse(localStorage.getItem('adminRatingBoosts') || '[]');
      const newBoost = {
        doctorId: selectedDoctor,
        boostAmount: parseFloat(boostValue),
        reason,
        adminId,
        timestamp: new Date().toISOString()
      };
      
      // Remove existing boost for this doctor and add new one
      const updatedBoosts = boosts.filter(b => b.doctorId !== selectedDoctor);
      updatedBoosts.push(newBoost);
      localStorage.setItem('adminRatingBoosts', JSON.stringify(updatedBoosts));
      
      // Dispatch auto-refresh events
      window.dispatchEvent(new CustomEvent('adminRatingUpdated', { 
        detail: { doctorId: selectedDoctor, boost: newBoost } 
      }));
      window.dispatchEvent(new Event('storage'));
      
      console.log('Admin rating boost saved and events dispatched');
      
      // Try API call (may fail in offline mode)
      try {
        await axios.post('/api/admin/boost-doctor', {
          doctorId: selectedDoctor,
          boostType: 'rating',
          boostValue: parseFloat(boostValue),
          reason,
          adminId
        });
      } catch (apiError) {
        console.log('API call failed, using localStorage only');
      }
      
      setMessage('Doctor rating boosted successfully!');
      setSelectedDoctor('');
      setBoostValue(0);
      setReason('');
    } catch (error) {
      setMessage('Error boosting rating: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 500 }}>
      <h2>Admin: Boost Doctor Rating</h2>
      
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Select Doctor</InputLabel>
        <Select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
          {doctors.map(doctor => (
            <MenuItem key={doctor._id} value={doctor._id}>
              Dr. {doctor.userId?.name} - {doctor.specialization} (Current: {doctor.finalRating}/5)
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Boost Value (0-5)"
        type="number"
        value={boostValue}
        onChange={(e) => setBoostValue(e.target.value)}
        inputProps={{ min: 0, max: 5, step: 0.1 }}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" onClick={handleBoost} disabled={!selectedDoctor || !boostValue}>
        Boost Rating
      </Button>

      {message && <Alert severity={message.includes('Error') ? 'error' : 'success'} sx={{ mt: 2 }}>{message}</Alert>}
    </Box>
  );
};

export default AdminRatingBoost;