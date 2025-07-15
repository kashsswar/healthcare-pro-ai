import React from 'react';
import { Box } from '@mui/material';
import AuthenticWebWidget from '../components/AuthenticWebWidget';

// Standalone page for embedding on external websites
function EmbedWidget() {
  return (
    <Box sx={{ 
      minHeight: '200px',
      p: 1,
      backgroundColor: 'transparent'
    }}>
      <AuthenticWebWidget embedded={true} />
    </Box>
  );
}

export default EmbedWidget;