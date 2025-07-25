import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, List, ListItem, ListItemText, 
  Button, Box, Chip, Alert
} from '@mui/material';
import { LocalHospital, LocationOn } from '@mui/icons-material';

function LocalDoctorsList({ user, onBookAppointment }) {
  const [localDoctors, setLocalDoctors] = useState([]);
  const [patientLocation, setPatientLocation] = useState(null);

  useEffect(() => {
    loadPatientLocation();
    loadLocalDoctors();
  }, []);

  const loadPatientLocation = () => {
    const savedProfile = localStorage.getItem(`patient_${user._id}_profile`);
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      if (profile.city && profile.state) {
        setPatientLocation({ city: profile.city, state: profile.state });
      }
    }
  };

  const loadLocalDoctors = () => {
    // Get all registered doctors from localStorage
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const doctors = allUsers.filter(u => u.role === 'doctor');
    
    const allDoctors = doctors.map(doctor => {
      // Get doctor profile data
      const profile = JSON.parse(localStorage.getItem(`doctor_${doctor._id}_profile`) || '{}');
      
      return {
        _id: doctor._id,
        userId: { name: doctor.name },
        specialization: profile.specialization || 'General Medicine',
        rating: 4.5,
        consultationFee: profile.consultationFee || 500,
        location: { 
          city: profile.city || 'Not specified', 
          state: profile.state || 'Not specified' 
        },
        phone: profile.phone || doctor.phone,
        qualification: profile.qualification || 'MBBS',
        experience: profile.experience || '1'
      };
    });

    if (patientLocation) {
      // Filter doctors from same city and state
      const filtered = allDoctors.filter(doctor => 
        doctor.location.city === patientLocation.city && 
        doctor.location.state === patientLocation.state
      );
      setLocalDoctors(filtered);
    } else {
      setLocalDoctors(allDoctors);
    }
  };

  useEffect(() => {
    loadLocalDoctors();
  }, [patientLocation]);

  if (!patientLocation) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Alert severity="info">
            📍 Complete your profile with city and state to see doctors near you first!
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocationOn color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">
            🏥 Doctors in {patientLocation.city}, {patientLocation.state}
          </Typography>
        </Box>

        {localDoctors.length === 0 ? (
          <Alert severity="warning">
            No doctors found in your city. Change location and see doctors list in Find Doctors tab.
          </Alert>
        ) : (
          <List>
            {localDoctors.map((doctor) => (
              <ListItem key={doctor._id} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocalHospital color="primary" />
                        <Typography variant="h6">{doctor.userId.name}</Typography>
                        <Chip label="Local" color="success" size="small" />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2">
                          🏥 {doctor.specialization} | ⭐ {doctor.rating}/5 | 💰 ₹{doctor.consultationFee}
                        </Typography>
                        <Typography variant="body2" color="primary">
                          📍 {doctor.location.city}, {doctor.location.state}
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onBookAppointment(doctor)}
                  sx={{ ml: 2 }}
                >
                  📅 Book Now
                </Button>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}

export default LocalDoctorsList;