import React from 'react';
import { Container, Paper, Typography } from '@mui/material';

function ShippingPolicy() {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Shipping Policy</Typography>
        
        <Typography variant="body1" paragraph>
          This healthcare platform provides digital consultation services only. No physical products are shipped.
        </Typography>
        
        <Typography variant="h6" gutterBottom>Service Delivery</Typography>
        <Typography variant="body1" paragraph>
          • Online consultations are delivered digitally via our platform
          • Appointment confirmations are sent via email and SMS
          • Prescription and medical reports are provided digitally
          • No physical shipping of products is involved
        </Typography>
        
        <Typography variant="h6" gutterBottom>Digital Service Access</Typography>
        <Typography variant="body1" paragraph>
          All services are accessible immediately after successful payment confirmation through your registered account.
        </Typography>
      </Paper>
    </Container>
  );
}

export default ShippingPolicy;