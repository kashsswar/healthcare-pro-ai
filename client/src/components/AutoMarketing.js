import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Box, Button, Alert, 
  LinearProgress, Chip 
} from '@mui/material';
import { Campaign, Share, TrendingUp } from '@mui/icons-material';

function AutoMarketing() {
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMarketingData();
    const interval = setInterval(loadMarketingData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadMarketingData = async () => {
    try {
      const response = await fetch('/api/marketing/auto-campaigns');
      const data = await response.json();
      setCampaigns(data.campaigns);
      setStats(data.stats);
    } catch (error) {
      console.error('Marketing data error:', error);
    }
  };

  const launchCampaign = async (campaignId) => {
    setLoading(true);
    try {
      await fetch(`/api/marketing/launch/${campaignId}`, { method: 'POST' });
      alert('Campaign launched successfully!');
      loadMarketingData();
    } catch (error) {
      alert('Campaign launch failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Campaign color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">🚀 Auto-Marketing Engine</Typography>
        </Box>

        <Alert severity="success" sx={{ mb: 2 }}>
          📈 Marketing campaigns running automatically. Current reach: {stats.totalReach || 0} people
        </Alert>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>📊 Live Marketing Stats:</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip label={`WhatsApp: ${stats.whatsappReach || 0}`} color="success" />
            <Chip label={`Social Media: ${stats.socialReach || 0}`} color="info" />
            <Chip label={`Referrals: ${stats.referralReach || 0}`} color="warning" />
            <Chip label={`New Users: ${stats.newUsers || 0}`} color="primary" />
          </Box>
        </Box>

        <Typography variant="subtitle1" gutterBottom>🎯 Active Campaigns:</Typography>
        {campaigns.map((campaign) => (
          <Box key={campaign.id} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {campaign.name}
              </Typography>
              <Chip 
                label={campaign.status} 
                color={campaign.status === 'active' ? 'success' : 'default'}
                size="small"
              />
            </Box>
            
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              {campaign.description}
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2">
                Reach: {campaign.currentReach}/{campaign.targetReach} | 
                ROI: {campaign.roi}%
              </Typography>
              
              {campaign.status === 'ready' && (
                <Button 
                  size="small" 
                  variant="contained"
                  onClick={() => launchCampaign(campaign.id)}
                  disabled={loading}
                  startIcon={<TrendingUp />}
                >
                  Launch
                </Button>
              )}
            </Box>
            
            {campaign.status === 'active' && (
              <LinearProgress 
                variant="determinate" 
                value={(campaign.currentReach / campaign.targetReach) * 100}
                sx={{ mt: 1 }}
              />
            )}
          </Box>
        ))}

        <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
          <Typography variant="body2">
            💡 <strong>Auto-Marketing Features:</strong>
            <br />• WhatsApp health tips with app links sent to 1000+ people daily
            <br />• Social media posts about success stories auto-generated
            <br />• Referral rewards distributed automatically
            <br />• Doctor testimonials shared in medical groups
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default AutoMarketing;