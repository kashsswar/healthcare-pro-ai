import React from 'react';
import { Container, Paper, Typography, Box, Grid } from '@mui/material';
import { Email, Phone, LocationOn } from '@mui/icons-material';

function ContactUs() {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Contact Us</Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Email sx={{ mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="h6">Email</Typography>
                <Typography>kashsswar@gmail.com</Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Phone sx={{ mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="h6">Phone</Typography>
                <Typography>+91-8279200147</Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOn sx={{ mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="h6">Address</Typography>
                <Typography>Aniruddh Nagar, Bharatpur</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Business Hours</Typography>
        <Typography>Monday - Friday: 9:00 AM - 6:00 PM</Typography>
        <Typography>Saturday: 10:00 AM - 4:00 PM</Typography>
        <Typography>Sunday: Closed</Typography>
      </Paper>
    </Container>
  );
}

export default ContactUs;