import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid, Chip, Alert } from '@mui/material';
import { TrendingUp, MonetizationOn, Share } from '@mui/icons-material';
import axios from 'axios';

const ProfessionalAdminPanel = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [boostValue, setBoostValue] = useState(0);
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    fetchDoctors();
    fetchAnalytics();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('/api/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/api/admin/marketing-stats');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleBoost = async () => {
    try {
      const adminId = localStorage.getItem('userId');
      await axios.post('/api/admin/boost-doctor', {
        doctorId: selectedDoctor,
        boostType: 'rating',
        boostValue: parseFloat(boostValue),
        reason,
        adminId
      });
      setMessage('✅ Doctor rating boosted successfully! Marketing reach increased.');
      setSelectedDoctor('');
      setBoostValue(0);
      setReason('');
      fetchDoctors();
    } catch (error) {
      setMessage('❌ Error: ' + error.response?.data?.message);
    }
  };

  const generateViralCampaign = async (doctorId) => {
    try {
      const response = await axios.post('/api/viral/generate-content', {
        doctorId,
        userType: 'admin',
        contentType: 'promotion'
      });
      
      const content = response.data.campaigns.whatsapp;
      navigator.clipboard.writeText(content);
      setMessage('🚀 Viral campaign content copied to clipboard!');
    } catch (error) {
      setMessage('Error generating campaign: ' + error.message);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        🏥 Professional Admin Control Center
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>⭐ Strategic Rating Enhancement</Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Doctor for Enhancement</InputLabel>
              <Select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
                {doctors.map(doctor => (
                  <MenuItem key={doctor._id} value={doctor._id}>
                    Dr. {doctor.userId?.name} - {doctor.specialization} 
                    <Chip label={`${doctor.finalRating}/5`} size="small" sx={{ ml: 1 }} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Enhancement Value (0-5)"
              type="number"
              value={boostValue}
              onChange={(e) => setBoostValue(e.target.value)}
              inputProps={{ min: 0, max: 5, step: 0.1 }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Strategic Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Market positioning, Quality assurance, Competitive advantage"
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                onClick={handleBoost} 
                disabled={!selectedDoctor || !boostValue}
                startIcon={<TrendingUp />}
              >
                Apply Enhancement
              </Button>
              
              <Button 
                variant="outlined" 
                onClick={() => generateViralCampaign(selectedDoctor)}
                disabled={!selectedDoctor}
                startIcon={<Share />}
              >
                Generate Viral Campaign
              </Button>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, bgcolor: '#f8f9fa' }}>
            <Typography variant="h6" gutterBottom>📊 Platform Metrics</Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">Total Doctors</Typography>
              <Typography variant="h4" color="primary">{doctors.length}</Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">Avg Rating</Typography>
              <Typography variant="h4" color="success.main">
                {(doctors.reduce((acc, d) => acc + d.finalRating, 0) / doctors.length || 0).toFixed(1)}
              </Typography>
            </Box>

            <Chip label="AI-Powered Growth" color="secondary" size="small" />
            <Chip label="Viral Marketing" color="primary" size="small" sx={{ ml: 1 }} />
          </Card>
        </Grid>
      </Grid>

      {message && (
        <Alert 
          severity={message.includes('Error') || message.includes('❌') ? 'error' : 'success'} 
          sx={{ mt: 2 }}
        >
          {message}
        </Alert>
      )}

      <Card sx={{ mt: 3, p: 3, bgcolor: '#e8f5e8' }}>
        <Typography variant="h6" gutterBottom>💡 AI Marketing Intelligence</Typography>
        <Typography variant="body2" color="textSecondary">
          • Enhanced doctors get 3x more visibility
          • Viral campaigns increase referrals by 400%
          • AI-generated content drives organic growth
          • Platform commission: 12% per consultation
        </Typography>
      </Card>
    </Box>
  );
};

export default ProfessionalAdminPanel;