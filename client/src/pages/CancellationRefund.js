import React from 'react';
import { Container, Paper, Typography } from '@mui/material';

function CancellationRefund() {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Cancellation and Refund Policy</Typography>
        
        <Typography variant="h6" gutterBottom>Patient Cancellation</Typography>
        <Typography variant="body1" paragraph>
          • Cancel up to 2 hours before appointment: 100% refund
          • Cancel within 2 hours: 50% refund
          • No-show: No refund
          • Refunds processed within 5-7 business days
        </Typography>
        
        <Typography variant="h6" gutterBottom>Doctor Cancellation</Typography>
        <Typography variant="body1" paragraph>
          • Doctor cancellation: 100% refund to patient
          • Emergency cancellations: Full refund + rescheduling priority
          • Refunds processed immediately
        </Typography>
        
        <Typography variant="h6" gutterBottom>Technical Issues</Typography>
        <Typography variant="body1" paragraph>
          • Platform technical problems: Full refund
          • Internet connectivity issues: Case-by-case review
          • Consultation quality issues: Partial/full refund based on review
        </Typography>
        
        <Typography variant="h6" gutterBottom>Refund Process</Typography>
        <Typography variant="body1" paragraph>
          • Refunds credited to original payment method
          • Processing time: 5-7 business days
          • Refund status notifications via email/SMS
          • Contact support for refund queries
        </Typography>
        
        <Typography variant="h6" gutterBottom>Non-Refundable</Typography>
        <Typography variant="body1" paragraph>
          • Completed consultations
          • Prescription fees (if applicable)
          • Platform service charges for completed services
        </Typography>
      </Paper>
    </Container>
  );
}

export default CancellationRefund;