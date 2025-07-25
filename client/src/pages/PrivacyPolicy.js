import React from 'react';
import { Container, Paper, Typography } from '@mui/material';

function PrivacyPolicy() {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Privacy Policy</Typography>
        
        <Typography variant="h6" gutterBottom>Information We Collect</Typography>
        <Typography variant="body1" paragraph>
          • Personal details (name, email, phone)
          • Medical information and symptoms
          • Payment and billing information
          • Consultation history and records
        </Typography>
        
        <Typography variant="h6" gutterBottom>How We Use Information</Typography>
        <Typography variant="body1" paragraph>
          • Facilitate doctor-patient consultations
          • Process payments and billing
          • Send appointment reminders and updates
          • Improve platform services
          • Comply with legal requirements
        </Typography>
        
        <Typography variant="h6" gutterBottom>Information Sharing</Typography>
        <Typography variant="body1" paragraph>
          • Medical information shared only with consulting doctors
          • Payment information processed through secure payment gateways
          • No personal data sold to third parties
          • Legal compliance sharing when required
        </Typography>
        
        <Typography variant="h6" gutterBottom>Data Security</Typography>
        <Typography variant="body1" paragraph>
          • End-to-end encryption for sensitive data
          • Secure payment processing via Razorpay
          • Regular security audits and updates
          • HIPAA-compliant data handling
        </Typography>
        
        <Typography variant="h6" gutterBottom>Your Rights</Typography>
        <Typography variant="body1" paragraph>
          • Access your personal data
          • Request data correction or deletion
          • Opt-out of marketing communications
          • Data portability upon request
        </Typography>
        
        <Typography variant="h6" gutterBottom>Contact</Typography>
        <Typography variant="body1" paragraph>
          For privacy concerns, contact: kashsswar@gmail.com
        </Typography>
      </Paper>
    </Container>
  );
}

export default PrivacyPolicy;