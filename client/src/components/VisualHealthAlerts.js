import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Button, Dialog, DialogContent, IconButton } from '@mui/material';
import { Warning, LocalHospital, Close } from '@mui/icons-material';

function VisualHealthAlerts() {
  const [currentAlert, setCurrentAlert] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const healthAlerts = [
    {
      icon: '🦷',
      title: 'AI दांत स्वास्थ्य सुझाव',
      subtitle: 'AI Dental Health Insights',
      description: 'AI के अनुसार दांतों की नियमित जांच जरूरी',
      action: 'BDS विशेषज्ञ से मिलें',
      urgency: 'medium',
      color: 'primary'
    },
    {
      icon: '🤒',
      title: 'AI स्वास्थ्य मॉनिटरिंग',
      subtitle: 'AI Health Monitoring',
      description: 'AI के अनुसार लक्षणों का समय पर इलाज महत्वपूर्ण',
      action: 'MBBS डॉक्टर से सलाह',
      urgency: 'medium',
      color: 'secondary'
    },
    {
      icon: '💫',
      title: 'AI प्रिवेंटिव केयर',
      subtitle: 'AI Preventive Care',
      description: 'AI डेटा के आधार पर बचाव बेहतर इलाज',
      action: 'नियमित जांच कराएं',
      urgency: 'low',
      color: 'info'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAlert((prev) => (prev + 1) % healthAlerts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const alert = healthAlerts[currentAlert];

  if (!isVisible) return null;

  return (
    <>
      <Card 
        sx={{ 
          position: 'fixed', 
          top: 80, 
          right: 16, 
          width: 280,
          zIndex: 999,
          bgcolor: `${alert.color}.light`,
          border: 2,
          borderColor: `${alert.color}.main`,
        }}
        onClick={() => setShowDialog(true)}
      >
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
          }}
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            color: 'grey.600',
            '&:hover': { color: 'grey.800' },
            zIndex: 1000
          }}
          size="small"
        >
          <Close fontSize="small" />
        </IconButton>
        <CardContent sx={{ p: 2, pr: 5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="h4" sx={{ mr: 1 }}>{alert.icon}</Typography>

          </Box>
          
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            {alert.title}
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 1 }}>
            {alert.subtitle}
          </Typography>
          
          <Button 
            variant="contained" 
            color={alert.color}
            size="small"
            fullWidth
            startIcon={<LocalHospital />}
          >
            {alert.action}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onClose={() => setShowDialog(false)} maxWidth="sm" fullWidth>
        <DialogContent sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h3" sx={{ mb: 2 }}>{alert.icon}</Typography>
          <Typography variant="h5" gutterBottom color={`${alert.color}.main`}>
            {alert.title}
          </Typography>
          <Typography variant="h6" gutterBottom>
            {alert.subtitle}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem' }}>
            {alert.description}
          </Typography>
          
          <Box sx={{ bgcolor: 'success.light', p: 2, borderRadius: 1, mb: 3 }}>
            <Typography variant="h6">🤖 AI Health Insights:</Typography>
            <Typography>• Personalized doctor matching based on symptoms</Typography>
            <Typography>• Smart appointment scheduling for optimal care</Typography>
            <Typography>• Preventive health recommendations powered by AI</Typography>
          </Box>
          
          <Button 
            variant="contained" 
            color={alert.color}
            size="large"
            onClick={() => {
              setShowDialog(false);
              window.location.href = '/doctors';
            }}
          >
            🤖 {alert.action} / AI Recommended
          </Button>
        </DialogContent>
      </Dialog>


    </>
  );
}

export default VisualHealthAlerts;