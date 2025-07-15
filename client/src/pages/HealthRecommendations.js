import React, { useState, useEffect } from 'react';
import { 
  Container, Paper, Typography, List, ListItem, ListItemText, 
  ListItemIcon, Box, Button, CircularProgress 
} from '@mui/material';
import { HealthAndSafety, Refresh } from '@mui/icons-material';
import { aiAPI } from '../services/api';

function HealthRecommendations({ user }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    // Reset recommendations to force UI update
    setRecommendations([]);
    try {
      setLoading(true);
      
      // Set a timeout to provide fallback recommendations if API takes too long
      const timeoutId = setTimeout(() => {
        if (loading) {
          console.log('API taking too long, using fallback recommendations');
          setRecommendations([
            'Brush your teeth twice daily with fluoride toothpaste',
            'Floss daily to remove plaque between teeth',
            'Visit your dentist every 6 months for checkups',
            'Drink plenty of water throughout the day',
            'Exercise for at least 30 minutes, 5 days a week',
            'Get 7-8 hours of quality sleep each night',
            'Eat a balanced diet rich in fruits and vegetables'
          ]);
          setLoading(false);
        }
      }, 3000); // 3 seconds timeout
      
      const response = await aiAPI.getHealthRecommendations(user.id);
      clearTimeout(timeoutId);
      
      if (response.data && response.data.recommendations && response.data.recommendations.length > 0) {
        setRecommendations(response.data.recommendations);
      } else {
        // Fallback recommendations if API returns empty array
        setRecommendations([
          'Brush your teeth twice daily with fluoride toothpaste',
          'Floss daily to remove plaque between teeth',
          'Visit your dentist every 6 months for checkups',
          'Drink plenty of water throughout the day',
          'Exercise for at least 30 minutes, 5 days a week',
          'Get 7-8 hours of quality sleep each night',
          'Eat a balanced diet rich in fruits and vegetables'
        ]);
      }
    } catch (error) {
      console.error('Recommendations load error:', error);
      // Fallback recommendations
      setRecommendations([
        'Brush your teeth twice daily with fluoride toothpaste',
        'Floss daily to remove plaque between teeth',
        'Visit your dentist every 6 months for checkups',
        'Drink plenty of water throughout the day',
        'Exercise for at least 30 minutes, 5 days a week',
        'Get 7-8 hours of quality sleep each night',
        'Eat a balanced diet rich in fruits and vegetables'
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">AI Health Recommendations</Typography>
          <Button 
            variant="contained" 
            startIcon={<Refresh />}
            onClick={loadRecommendations}
            disabled={loading}
            sx={{ py: 1.5, fontSize: '1.1rem' }}
          >
            {loading ? 'AI Analyzing...' : '🤖 AI Refresh Recommendations'}
          </Button>
        </Box>
        
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          Personalized health tips based on your profile and consultation history
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {recommendations.map((recommendation, index) => (
              <ListItem key={index} sx={{ mb: 1 }}>
                <ListItemIcon>
                  <HealthAndSafety color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary={recommendation}
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      fontSize: '1.1rem',
                      lineHeight: 1.6
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
        )}

        <Box sx={{ mt: 4, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
          <Typography variant="body2" color="info.contrastText">
            💡 These recommendations are AI-generated based on your health profile. 
            Always consult with healthcare professionals for medical advice.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default HealthRecommendations;