import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Button, Box, Chip, 
  Dialog, DialogContent, DialogTitle, IconButton, Snackbar, Alert 
} from '@mui/material';
import { Share, ContentCopy, Close, AutoAwesome } from '@mui/icons-material';
import axios from 'axios';

function AutoMarketing() {
  const [marketingContent, setMarketingContent] = useState('');
  const [testimonial, setTestimonial] = useState(null);
  const [healthTip, setHealthTip] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateDailyContent();
  }, []);

  const generateDailyContent = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      
      // Generate social media content
      const socialRes = await axios.post(`${apiUrl}/api/auto-marketing/generate-content`, {
        type: 'social'
      });
      setMarketingContent(socialRes.data.content);
      
      // Get testimonial
      const testimonialRes = await axios.post(`${apiUrl}/api/auto-marketing/generate-testimonial`);
      setTestimonial(testimonialRes.data);
      
      // Get health tip
      const tipRes = await axios.get(`${apiUrl}/api/auto-marketing/daily-health-tip`);
      setHealthTip(tipRes.data.tip);
    } catch (error) {
      console.error('Auto-marketing content generation failed:', error);
      // Fallback content
      setMarketingContent("🏥 Experience healthcare like never before! Book appointments with verified doctors instantly. Your health, simplified! 💊✨");
      setHealthTip("💧 Remember to stay hydrated! Drink plenty of water throughout the day.");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  const shareContent = async (text) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'HealthConnect AI',
          text: text,
          url: window.location.origin
        });
      } catch (error) {
        copyToClipboard(text);
      }
    } else {
      copyToClipboard(text);
    }
  };

  return (
    <>
      <Card sx={{ mb: 2, border: '2px solid', borderColor: 'primary.main' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AutoAwesome color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Health Awareness Hub</Typography>
          </Box>
          
          <Typography variant="body1" sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            {marketingContent}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button 
              variant="contained" 
              startIcon={<Share />}
              onClick={() => shareContent(marketingContent)}
              size="small"
            >
              Share to Help Others
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<ContentCopy />}
              onClick={() => copyToClipboard(marketingContent)}
              size="small"
            >
              Copy
            </Button>
            <Button 
              variant="outlined" 
              onClick={generateDailyContent}
              size="small"
            >
              🤖 Generate New
            </Button>
          </Box>

          {/* Health Tip */}
          <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1, mb: 2 }}>
            <Typography variant="subtitle2" color="success.dark">Today's Health Tip:</Typography>
            <Typography variant="body2">{healthTip}</Typography>
            <Button 
              size="small" 
              onClick={() => shareContent(healthTip)}
              sx={{ mt: 1 }}
            >
              Share Tip
            </Button>
          </Box>

          {/* Testimonial */}
          {testimonial && (
            <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="info.dark">Patient Success Story:</Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1 }}>
                "{testimonial.text}"
              </Typography>
              <Typography variant="caption">
                - {testimonial.name} ({testimonial.specialization})
              </Typography>
              <Button 
                size="small" 
                onClick={() => shareContent(`"${testimonial.text}" - ${testimonial.name}`)}
                sx={{ mt: 1, display: 'block' }}
              >
                Share Story
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      <Snackbar 
        open={copied} 
        autoHideDuration={2000} 
        onClose={() => setCopied(false)}
      >
        <Alert severity="success">Content copied to clipboard!</Alert>
      </Snackbar>
    </>
  );
}

export default AutoMarketing;