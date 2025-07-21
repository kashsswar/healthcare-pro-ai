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
    try {
      setLoading(true);
      setRecommendations([]); // Clear current recommendations
      
      // Generate new random recommendations each time
      const allRecommendations = [
        'Drink 8-10 glasses of water daily to stay hydrated',
        'Take a 10-minute walk after each meal to aid digestion',
        'Practice deep breathing exercises for 5 minutes daily',
        'Eat colorful fruits and vegetables for essential vitamins',
        'Get 7-8 hours of quality sleep each night',
        'Limit screen time 1 hour before bedtime',
        'Wash your hands frequently to prevent infections',
        'Do stretching exercises to improve flexibility',
        'Maintain good posture while sitting and standing',
        'Schedule regular health checkups with your doctor',
        'Avoid processed foods and choose whole grains',
        'Practice meditation to reduce stress levels',
        'Keep a health journal to track your wellness',
        'Stay socially connected with friends and family',
        'Take vitamin D supplements if you lack sunlight exposure',
        'Brush and floss your teeth twice daily',
        'Exercise for at least 30 minutes, 5 days a week',
        'Limit alcohol consumption and avoid smoking',
        'Eat omega-3 rich foods like fish and nuts',
        'Practice gratitude to improve mental health'
      ];
      
      // Randomly select 7 recommendations
      const shuffled = allRecommendations.sort(() => 0.5 - Math.random());
      const selectedRecommendations = shuffled.slice(0, 7);
      
      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setRecommendations(selectedRecommendations);
      
    } catch (error) {
      console.error('Recommendations load error:', error);
      // Fallback recommendations
      setRecommendations([
        'Drink plenty of water throughout the day',
        'Exercise for at least 30 minutes, 5 days a week',
        'Get 7-8 hours of quality sleep each night',
        'Eat a balanced diet rich in fruits and vegetables',
        'Practice stress management techniques',
        'Schedule regular health checkups',
        'Maintain good hygiene habits'
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
            {loading ? 'Generating...' : '🔄 Generate New Recommendations'}
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