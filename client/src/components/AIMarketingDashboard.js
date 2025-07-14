import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Button, Grid, Box, TextField,
  Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  Tab, Tabs, CircularProgress, Alert
} from '@mui/material';
import { AutoAwesome, Campaign, Share, Email, WhatsApp, TrendingUp } from '@mui/icons-material';
import axios from 'axios';

const AIMarketingDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [analytics, setAnalytics] = useState({});
  const [campaigns, setCampaigns] = useState([]);
  const [contentDialog, setContentDialog] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await axios.get('/api/marketing/analytics');
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Analytics error:', error);
    }
  };

  const generateSocialContent = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/marketing/generate-content', {
        specialization: 'General Medicine',
        targetAudience: 'general'
      });
      setGeneratedContent(response.data.content);
      setContentDialog(true);
    } catch (error) {
      console.error('Content generation error:', error);
    }
    setLoading(false);
  };

  const generateWhatsAppCampaign = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/marketing/generate-whatsapp', {
        doctorId: '507f1f77bcf86cd799439011' // Sample doctor ID
      });
      setGeneratedContent(response.data.message);
      setContentDialog(true);
    } catch (error) {
      console.error('WhatsApp generation error:', error);
    }
    setLoading(false);
  };

  const generateEmailCampaign = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/marketing/generate-email', {
        campaignType: 'health_awareness',
        targetAudience: 'patients'
      });
      setGeneratedContent(response.data.campaign);
      setContentDialog(true);
    } catch (error) {
      console.error('Email generation error:', error);
    }
    setLoading(false);
  };

  const runAutoCampaign = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/marketing/auto-campaign');
      setCampaigns(response.data.campaigns);
      alert(`Generated ${response.data.campaigns.length} marketing campaigns!`);
    } catch (error) {
      console.error('Auto campaign error:', error);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🤖 AI Marketing Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Doctors</Typography>
              <Typography variant="h3" color="primary">
                {analytics.totalDoctors || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Patients</Typography>
              <Typography variant="h3" color="success.main">
                {analytics.totalPatients || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Marketing Potential</Typography>
              <Typography variant="h3" color="warning.main">
                {analytics.marketingPotential || 0}
              </Typography>
              <Typography variant="body2">campaigns/week</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Estimated Reach</Typography>
              <Typography variant="h3" color="info.main">
                {analytics.estimatedReach || 0}
              </Typography>
              <Typography variant="body2">people</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Content Generation" />
            <Tab label="Auto Campaigns" />
            <Tab label="Analytics" />
          </Tabs>

          {activeTab === 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                AI Content Generation
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Share />}
                    onClick={generateSocialContent}
                    disabled={loading}
                    sx={{ mb: 2 }}
                  >
                    Generate Social Media Post
                  </Button>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<WhatsApp />}
                    onClick={generateWhatsAppCampaign}
                    disabled={loading}
                    color="success"
                    sx={{ mb: 2 }}
                  >
                    Generate WhatsApp Message
                  </Button>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Email />}
                    onClick={generateEmailCampaign}
                    disabled={loading}
                    color="info"
                    sx={{ mb: 2 }}
                  >
                    Generate Email Campaign
                  </Button>
                </Grid>
              </Grid>

              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <CircularProgress />
                </Box>
              )}
            </Box>
          )}

          {activeTab === 1 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Automated Marketing Campaigns
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                AI will automatically generate and schedule marketing content for all your doctors
              </Alert>
              
              <Button
                variant="contained"
                size="large"
                startIcon={<AutoAwesome />}
                onClick={runAutoCampaign}
                disabled={loading}
                sx={{ mb: 3 }}
              >
                🚀 Run Auto Marketing Campaign
              </Button>

              {campaigns.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Generated Campaigns ({campaigns.length})
                  </Typography>
                  {campaigns.map((campaign, index) => (
                    <Chip
                      key={index}
                      label={campaign.specialization}
                      sx={{ m: 0.5 }}
                      color="primary"
                    />
                  ))}
                </Box>
              )}
            </Box>
          )}

          {activeTab === 2 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Marketing Analytics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6">Specializations Coverage</Typography>
                      <Typography variant="h4" color="primary">
                        {analytics.specializations || 0}
                      </Typography>
                      <Typography variant="body2">medical fields covered</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6">Weekly Campaign Potential</Typography>
                      <Typography variant="h4" color="success.main">
                        {Math.floor((analytics.marketingPotential || 0) / 4)}
                      </Typography>
                      <Typography variant="body2">automated campaigns</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>

      <Dialog open={contentDialog} onClose={() => setContentDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Generated Marketing Content</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            rows={10}
            fullWidth
            value={generatedContent}
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContentDialog(false)}>Close</Button>
          <Button variant="contained" onClick={() => navigator.clipboard.writeText(generatedContent)}>
            Copy Content
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AIMarketingDashboard;