import React, { useState, useEffect } from 'react';
import { 
  Grid, Card, CardContent, Typography, Box, Chip 
} from '@mui/material';

function DoctorCategories({ onCategorySelect, selectedCategory }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const response = await fetch(`${apiUrl}/api/doctors/categories`);
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
        🏥 Choose Your Doctor Category
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={6} sm={4} md={3}>
          <Card 
            sx={{ 
              cursor: 'pointer',
              bgcolor: !selectedCategory ? 'primary.light' : 'background.paper',
              '&:hover': { bgcolor: 'primary.light' }
            }}
            onClick={() => onCategorySelect(null)}
          >
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4">🏥</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                All Doctors
              </Typography>
              <Chip label="View All" size="small" color="primary" />
            </CardContent>
          </Card>
        </Grid>
        
        {categories && categories.length > 0 && categories.map((category) => (
          <Grid item xs={6} sm={4} md={3} key={category.id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                bgcolor: selectedCategory === category.name ? 'primary.light' : 'background.paper',
                '&:hover': { bgcolor: 'primary.light' }
              }}
              onClick={() => onCategorySelect(category.name)}
            >
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4">{category.icon}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  {category.name.replace(/^.+ /, '')}
                </Typography>
                <Chip 
                  label={`${category.count} doctors`} 
                  size="small" 
                  color={selectedCategory === category.name ? 'primary' : 'default'}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
        
        {(!categories || categories.length === 0) && (
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary" align="center">
              Loading categories...
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default DoctorCategories;