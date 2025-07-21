import React, { useState } from 'react';
import { 
  Container, Card, CardContent, Typography, Box, 
  Accordion, AccordionSummary, AccordionDetails, Button
} from '@mui/material';
import { ExpandMore, Warning, Info } from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

function HealthEducation() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const dentalMyths = [
    {
      myth: "🦷 Tooth pain will go away on its own",
      reality: "❌ Ignoring tooth pain can lead to serious infections that spread to your heart and brain. Early treatment saves money and prevents life-threatening complications.",
      urgency: "high"
    },
    {
      myth: "🍬 Sugar-free means safe for teeth", 
      reality: "⚠️ Many 'sugar-free' foods contain acids that damage teeth. Regular dental checkups catch problems early.",
      urgency: "medium"
    },
    {
      myth: "👶 Baby teeth don't matter",
      reality: "🚨 Infected baby teeth affect permanent teeth and child's overall health. BDS doctors specialize in preventing these problems.",
      urgency: "high"
    }
  ];

  const generalMyths = [
    {
      myth: "💊 Home remedies cure everything",
      reality: "⚠️ Delaying proper medical treatment can turn minor issues into major health crises. MBBS doctors provide scientific treatment.",
      urgency: "high"
    },
    {
      myth: "🤒 Fever always needs medicine",
      reality: "📋 Sometimes fever helps fight infection. MBBS doctors know when to treat and when to monitor.",
      urgency: "medium"
    },
    {
      myth: "💉 Vaccines are dangerous",
      reality: "✅ Vaccines prevent deadly diseases. MBBS doctors provide safe, life-saving immunizations.",
      urgency: "high"
    }
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: 'error.main' }}>
        🚨 Health Myths That Can Kill You
      </Typography>
      
      <Card sx={{ mb: 3, bgcolor: 'error.light', color: 'error.contrastText' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            ⚠️ WARNING: These common beliefs have caused deaths in rural areas
          </Typography>
          <Typography>
            Don't let myths cost you your life or money. Get facts from qualified doctors.
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
        🦷 Dental Health Myths (BDS Doctor Needed)
      </Typography>
      
      {dentalMyths.map((item, index) => (
        <Accordion key={index} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {item.urgency === 'high' && <Warning color="error" />}
              {item.urgency === 'medium' && <Info color="warning" />}
              <Typography variant="h6">{item.myth}</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ mb: 2 }}>{item.reality}</Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/doctors?specialization=Dentistry')}>
              Find BDS Doctor Now 🦷
            </Button>
          </AccordionDetails>
        </Accordion>
      ))}

      <Typography variant="h5" gutterBottom sx={{ color: 'secondary.main', mt: 4 }}>
        🩺 General Health Myths (MBBS Doctor Needed)
      </Typography>
      
      {generalMyths.map((item, index) => (
        <Accordion key={index} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {item.urgency === 'high' && <Warning color="error" />}
              {item.urgency === 'medium' && <Info color="warning" />}
              <Typography variant="h6">{item.myth}</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ mb: 2 }}>{item.reality}</Typography>
            <Button variant="contained" color="secondary" onClick={() => navigate('/doctors?specialization=General Medicine')}>
              Find MBBS Doctor Now 🩺
            </Button>
          </AccordionDetails>
        </Accordion>
      ))}

      <Card sx={{ mt: 4, bgcolor: 'success.light' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            💡 Smart Health Investment
          </Typography>
          <Typography>
            • Early treatment costs ₹500-2000
            • Emergency treatment costs ₹10,000-50,000
            • Prevention is 10x cheaper than cure
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={() => navigate('/doctors')} sx={{ mr: 2 }}>
              Book Preventive Checkup
            </Button>
            <Button variant="outlined" onClick={() => navigate('/health-recommendations')}>
              Get Health Tips
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default HealthEducation;