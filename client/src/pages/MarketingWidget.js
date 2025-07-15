import React from 'react';
import { Container, Box } from '@mui/material';
import PublicMarketingEngine from '../components/PublicMarketingEngine';

// Standalone marketing page that can be embedded anywhere
function MarketingWidget() {
  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Box sx={{ minHeight: '400px' }}>
        <PublicMarketingEngine />
      </Box>
    </Container>
  );
}

export default MarketingWidget;