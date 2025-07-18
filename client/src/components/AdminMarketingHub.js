import React from 'react';
import { Box, Typography, Alert } from '@mui/material';

function AdminMarketingHub() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        📊 Analytics Dashboard
      </Typography>
      
      <Alert severity="info">
        Marketing features have been disabled for security and compliance reasons.
        Contact system administrator for marketing campaign management.
      </Alert>
    </Box>
  );
}

export default AdminMarketingHub;