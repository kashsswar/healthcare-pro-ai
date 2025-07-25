import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Footer() {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: 'grey.100', py: 3, mt: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Healthcare Platform</Typography>
            <Typography variant="body2" color="textSecondary">
              Connecting patients with qualified doctors for quality healthcare.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Legal</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link onClick={() => navigate('/contact')} sx={{ cursor: 'pointer' }}>Contact Us</Link>
              <Link onClick={() => navigate('/terms')} sx={{ cursor: 'pointer' }}>Terms & Conditions</Link>
              <Link onClick={() => navigate('/privacy-policy')} sx={{ cursor: 'pointer' }}>Privacy Policy</Link>
              <Link onClick={() => navigate('/cancellation-refund')} sx={{ cursor: 'pointer' }}>Cancellation & Refund</Link>
              <Link onClick={() => navigate('/shipping-policy')} sx={{ cursor: 'pointer' }}>Shipping Policy</Link>
            </Box>
          </Grid>
        </Grid>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2, textAlign: 'center' }}>
          © 2024 Healthcare Platform. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;