import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Button, Box, Chip, IconButton, Fade
} from '@mui/material';
import { HealthAndSafety, Close, OpenInNew } from '@mui/icons-material';

// Authentic, non-intrusive web widget that appears on external sites
function AuthenticWebWidget({ embedded = false }) {
  const [content, setContent] = useState(null);
  const [visible, setVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const authenticContent = [
    {
      type: 'health-awareness',
      icon: '❤️',
      title: 'Heart Health Alert',
      message: 'Heart disease affects 1 in 4 people. Regular checkups can prevent 80% of heart problems.',
      cta: 'Find Cardiologist',
      urgency: 'medium'
    },
    {
      type: 'healthcare-convenience',
      icon: '⏰',
      title: 'Skip the Waiting Room',
      message: 'Average clinic wait time: 2.5 hours. Online consultations: 2 minutes to connect.',
      cta: 'Try Online Consultation',
      urgency: 'low'
    },
    {
      type: 'preventive-care',
      icon: '🩺',
      title: 'Preventive Care Reminder',
      message: 'Annual health checkups can detect 70% of health issues before symptoms appear.',
      cta: 'Schedule Checkup',
      urgency: 'medium'
    },
    {
      type: 'specialist-access',
      icon: '👨‍⚕️',
      title: 'Specialist Shortage',
      message: 'Finding specialists takes 3-6 weeks. Get instant access to 500+ verified specialists.',
      cta: 'Find Specialist',
      urgency: 'high'
    }
  ];

  useEffect(() => {
    // Rotate content every 30 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % authenticContent.length);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setContent(authenticContent[currentIndex]);
  }, [currentIndex]);

  const handleAction = () => {
    // Open in new tab to avoid disrupting user's current activity
    window.open('https://healthcare-pro-ai.onrender.com', '_blank');
  };

  if (!visible || !content) return null;

  return (
    <Fade in={visible}>
      <Card 
        sx={{ 
          position: embedded ? 'relative' : 'fixed',
          bottom: embedded ? 'auto' : 20,
          right: embedded ? 'auto' : 20,
          width: embedded ? '100%' : 320,
          maxWidth: embedded ? 'none' : 320,
          zIndex: embedded ? 'auto' : 1000,
          boxShadow: embedded ? 1 : 3,
          border: '1px solid #e0e0e0',
          borderLeft: `4px solid ${content.urgency === 'high' ? '#f44336' : content.urgency === 'medium' ? '#ff9800' : '#4caf50'}`
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          {!embedded && (
            <IconButton
              size="small"
              onClick={() => setVisible(false)}
              sx={{ position: 'absolute', top: 4, right: 4 }}
            >
              <Close fontSize="small" />
            </IconButton>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="h4" sx={{ mr: 1 }}>{content.icon}</Typography>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                {content.title}
              </Typography>
              <Chip 
                label="Health Insight" 
                size="small" 
                color="primary" 
                variant="outlined"
                sx={{ mb: 1 }}
              />
            </Box>
          </Box>
          
          <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.4 }}>
            {content.message}
          </Typography>
          
          <Button 
            variant="contained" 
            size="small" 
            fullWidth
            onClick={handleAction}
            startIcon={<OpenInNew />}
            sx={{ 
              textTransform: 'none',
              fontSize: '0.875rem'
            }}
          >
            {content.cta}
          </Button>
          
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block', 
              textAlign: 'center', 
              mt: 1, 
              color: 'text.secondary' 
            }}
          >
            Powered by HealthConnect AI
          </Typography>
        </CardContent>
      </Card>
    </Fade>
  );
}

export default AuthenticWebWidget;