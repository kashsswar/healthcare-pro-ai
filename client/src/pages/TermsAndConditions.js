import React from 'react';
import { Container, Paper, Typography } from '@mui/material';

function TermsAndConditions() {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Terms and Conditions</Typography>
        
        <Typography variant="h6" gutterBottom>1. Service Description</Typography>
        <Typography variant="body1" paragraph>
          Our platform connects patients with licensed healthcare professionals for online consultations.
        </Typography>
        
        <Typography variant="h6" gutterBottom>2. User Responsibilities</Typography>
        <Typography variant="body1" paragraph>
          • Provide accurate medical information
          • Follow prescribed treatments
          • Pay consultation fees as agreed
          • Respect doctor-patient confidentiality
        </Typography>
        
        <Typography variant="h6" gutterBottom>3. Doctor Responsibilities</Typography>
        <Typography variant="body1" paragraph>
          • Maintain professional medical standards
          • Provide timely consultations
          • Maintain patient confidentiality
          • Follow medical ethics and regulations
        </Typography>
        
        <Typography variant="h6" gutterBottom>4. Payment Terms</Typography>
        <Typography variant="body1" paragraph>
          • Consultation fees are payable in advance
          • Refunds processed as per cancellation policy
          • Platform charges 12% service fee from doctors
        </Typography>
        
        <Typography variant="h6" gutterBottom>5. Limitation of Liability</Typography>
        <Typography variant="body1" paragraph>
          The platform facilitates consultations but is not responsible for medical outcomes. 
          Emergency cases should contact local emergency services immediately.
        </Typography>
      </Paper>
    </Container>
  );
}

export default TermsAndConditions;