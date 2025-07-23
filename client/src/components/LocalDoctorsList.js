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
    // Sample doctors with locations
    const allDoctors = [
      {
        _id: '1',
        userId: { name: 'Dr. Amit Sharma' },
        specialization: 'Cardiology',
        rating: 4.8,
        consultationFee: 500,
        location: { city: 'Mumbai', state: 'Maharashtra' }
      },
      {
        _id: '2',
        userId: { name: 'Dr. Priya Patel' },
        specialization: 'General Medicine',
        rating: 4.6,
        consultationFee: 400,
        location: { city: 'Mumbai', state: 'Maharashtra' }
      },
      {
        _id: '3',
        userId: { name: 'Dr. Rajesh Kumar' },
        specialization: 'Dermatology',
        rating: 4.7,
        consultationFee: 450,
        location: { city: 'Delhi', state: 'Delhi' }
      }
    ];

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