import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, Chip, Button, 
  Avatar, Accordion, AccordionSummary, AccordionDetails 
} from '@mui/material';
import { ExpandMore, Star, Verified, Schedule, AccessTime } from '@mui/icons-material';
import axios from 'axios';

const DoctorsBySpecialization = () => {
  const [doctorsBySpec, setDoctorsBySpec] = useState({});

  useEffect(() => {
    fetchDoctorsBySpecialization();
  }, []);

  const fetchDoctorsBySpecialization = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/doctors/by-specialization`);
      setDoctorsBySpec(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const getAvailabilityDisplay = (availability) => {
    if (availability.isAvailable) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Chip label="Available" color="success" size="small" />
          <Typography variant="body2" color="success.main">
            {availability.timings.from} - {availability.timings.to}
          </Typography>
        </Box>
      );
    } else {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Chip label="Not Available" color="error" size="small" />
          {availability.nextAvailable && (
            <Typography variant="body2" color="error.main">
              Will be available {availability.nextAvailable.day}: {availability.nextAvailable.from} - {availability.nextAvailable.to}
            </Typography>
          )}
        </Box>
      );
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>👨‍⚕️ Doctors by Specialization</Typography>
      
      {Object.entries(doctorsBySpec).map(([specialization, doctors]) => (
        <Accordion key={specialization} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">
              {specialization} ({doctors.length} doctors)
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {doctors.map((doctor, index) => (
                <Grid item xs={12} md={6} lg={4} key={doctor._id}>
                  <Card 
                    sx={{ 
                      position: 'relative',
                      border: doctor.isFeatured ? '2px solid gold' : 'none',
                      boxShadow: doctor.isFeatured ? '0 4px 20px rgba(255,215,0,0.3)' : 'default'
                    }}
                  >
                    {doctor.isFeatured && (
                      <Chip 
                        label="⭐ FEATURED" 
                        color="warning" 
                        size="small" 
                        sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
                      />
                    )}
                    
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 50, height: 50 }}>
                          {index + 1}
                        </Avatar>
                        <Box>
                          <Typography variant="h6">
                            {doctor.userId.name}
                            {doctor.isVerified && <Verified color="primary" sx={{ ml: 1, fontSize: 16 }} />}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {doctor.qualification.join(', ')}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Star color="warning" />
                          <Typography variant="body1" fontWeight="bold">
                            {doctor.finalRating || doctor.rating}/5
                          </Typography>
                          {doctor.adminBoostRating > 0 && (
                            <Chip label={`+${doctor.adminBoostRating} Boost`} color="secondary" size="small" />
                          )}
                        </Box>
                        
                        <Typography variant="body2" color="textSecondary">
                          {doctor.experience} years experience • {doctor.location.city}
                        </Typography>
                        
                        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                          ₹{doctor.consultationFee}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        {getAvailabilityDisplay(doctor.availability)}
                      </Box>

                      <Button 
                        variant={doctor.availability.isAvailable ? "contained" : "outlined"}
                        color={doctor.availability.isAvailable ? "primary" : "secondary"}
                        fullWidth
                        disabled={!doctor.availability.isAvailable}
                        startIcon={doctor.availability.isAvailable ? <Schedule /> : <AccessTime />}
                      >
                        {doctor.availability.isAvailable ? 'Book Now' : 'Schedule Later'}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default DoctorsBySpecialization;