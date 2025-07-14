import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, Button, Grid, Chip, Alert } from '@mui/material';
import { Share, MonetizationOn, TrendingUp } from '@mui/icons-material';
import axios from 'axios';

const EarningsDashboard = ({ userId, userType }) => {
  const [earnings, setEarnings] = useState({});
  const [viralContent, setViralContent] = useState({});

  useEffect(() => {
    fetchEarnings();
    generateViralContent();
  }, [userId]);

  const fetchEarnings = async () => {
    try {
      const response = await axios.get(`/api/viral/earnings/${userId}`);
      setEarnings(response.data);
    } catch (error) {
      console.error('Error fetching earnings:', error);
    }
  };

  const generateViralContent = async () => {
    try {
      const response = await axios.post('/api/viral/generate-content', {
        userId, userType, contentType: 'referral'
      });
      setViralContent(response.data.campaigns);
    } catch (error) {
      console.error('Error generating content:', error);
    }
  };

  const shareContent = (platform) => {
    const content = viralContent[platform];
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(content)}`);
    } else {
      navigator.clipboard.writeText(content);
      alert('Content copied to clipboard!');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>💰 Your Earnings Dashboard</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e8' }}>
            <MonetizationOn color="success" sx={{ fontSize: 40 }} />
            <Typography variant="h4">₹{earnings.earnings?.totalEarned || 0}</Typography>
            <Typography color="textSecondary">Total Earned</Typography>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd' }}>
            <TrendingUp color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="h4">₹{earnings.projectedMonthly || 0}</Typography>
            <Typography color="textSecondary">Monthly Potential</Typography>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, textAlign: 'center', bgcolor: '#fff3e0' }}>
            <Share color="warning" sx={{ fontSize: 40 }} />
            <Typography variant="h4">{earnings.referralCount || 0}</Typography>
            <Typography color="textSecondary">Referrals Made</Typography>
          </Card>
        </Grid>
      </Grid>

      {userType === 'doctor' && (
        <Alert severity="info" sx={{ mt: 3 }}>
          <strong>Doctor Earning Rates:</strong> Doctor referrals: ₹500 | Patient referrals: ₹100 | Monthly Potential: ₹15,000+
        </Alert>
      )}
      
      {userType === 'patient' && (
        <Alert severity="success" sx={{ mt: 3 }}>
          <strong>Patient Benefits:</strong> AI doctor matching | Instant appointments | Real-time updates | 24/7 health tips
        </Alert>
      )}

      <Card sx={{ mt: 3, p: 3 }}>
        <Typography variant="h6" gutterBottom>🚀 Share & Earn More</Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            color="success"
            onClick={() => shareContent('whatsapp')}
            startIcon={<Share />}
          >
            Share on WhatsApp
          </Button>
          
          <Button 
            variant="outlined"
            onClick={() => shareContent('social')}
            startIcon={<Share />}
          >
            Copy Social Post
          </Button>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Chip label="Instant Payouts" color="success" />
          <Chip label="No Limits" color="primary" sx={{ ml: 1 }} />
          <Chip label="AI-Powered" color="secondary" sx={{ ml: 1 }} />
        </Box>
      </Card>
    </Box>
  );
};

export default EarningsDashboard;