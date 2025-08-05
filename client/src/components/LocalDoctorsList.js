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

  const loadPatientLocation = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/patient-profile/${user._id}`);
      
      if (response.ok) {
        const profile = await response.json();
        if (profile.city) {
          setPatientLocation({ city: profile.city, state: profile.state || '' });
        }
      } else {
        // Fallback to localStorage if API fails
        const savedProfile = localStorage.getItem(`patient_${user._id}_profile`);
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          if (profile.city) {
            setPatientLocation({ city: profile.city, state: profile.state || '' });
          }
        }
      }
    } catch (error) {
      console.error('Error loading patient location:', error);
      // Fallback to localStorage
      const savedProfile = localStorage.getItem(`patient_${user._id}_profile`);
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        if (profile.city) {
          setPatientLocation({ city: profile.city, state: profile.state || '' });
        }
      }
    }
  };

  const loadLocalDoctors = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/doctors`);
      
      if (response.ok) {
        const allDoctors = await response.json();
        console.log('All doctors from API:', allDoctors);
        
        if (patientLocation) {
          // Filter doctors from same city (case insensitive)
          const filtered = allDoctors.filter(doctor => {
            const doctorCity = (doctor.city || '').toLowerCase().trim();
            const patientCity = patientLocation.city.toLowerCase().trim();
            return doctorCity === patientCity;
          });
          
          console.log('Filtered doctors for', patientLocation.city, ':', filtered);
          setLocalDoctors(filtered);
        } else {
          setLocalDoctors(allDoctors);
        }
      } else {
        console.error('Failed to load doctors from API');
        setLocalDoctors([]);
      }
    } catch (error) {
      console.error('Error loading doctors:', error);
      setLocalDoctors([]);
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
                        <Typography variant="h6">Dr. {doctor.name || doctor.userId?.name}</Typography>
                        <Chip label="Local" color="success" size="small" />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2">
                          🏥 {doctor.specialization} | ⭐ {(doctor.finalRating || doctor.rating || 4.5).toFixed(1)}/5 | 💰 ₹{doctor.consultationFee}
                        </Typography>
                        <Typography variant="body2" color="primary">
                          📍 {doctor.city}, {doctor.state}
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