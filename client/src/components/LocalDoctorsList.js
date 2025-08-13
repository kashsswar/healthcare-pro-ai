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
      const userId = user._id || user.id;
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/patient-profile/${userId}`);
      
      if (response.ok) {
        const patientData = await response.json();
        if (patientData.profile?.city) {
          setPatientLocation({ 
            city: patientData.profile.city, 
            state: patientData.profile.state || '' 
          });
        }
      }
    } catch (error) {
      console.error('Error loading patient location:', error);
    }
  };

  const loadLocalDoctors = async () => {
    try {
      // Get real doctors from localStorage profiles (only registered doctors)
      const realDoctors = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('doctor_') && key.endsWith('_profile')) {
          try {
            const doctorProfile = JSON.parse(localStorage.getItem(key));
            const doctorId = key.replace('doctor_', '').replace('_profile', '');
            
            // Only include doctors with complete profiles (name, city, specialization)
            if (doctorProfile.city && doctorProfile.specialization && doctorProfile.name && doctorProfile.name !== 'Doctor') {
              realDoctors.push({
                _id: doctorId,
                name: doctorProfile.name,
                userId: { name: doctorProfile.name },
                specialization: doctorProfile.specialization,
                experience: parseInt(doctorProfile.experience) || 5,
                consultationFee: parseInt(doctorProfile.consultationFee) || 500,
                rating: 4.5,
                finalRating: 4.5,
                city: doctorProfile.city.trim(),
                state: doctorProfile.state || ''
              });
            }
          } catch (error) {
            console.log('Error parsing doctor profile:', error);
          }
        }
      }
      
      if (patientLocation) {
        const filtered = realDoctors.filter(doctor => {
          const doctorCity = doctor.city.toLowerCase().trim();
          const patientCity = patientLocation.city.toLowerCase().trim();
          return doctorCity === patientCity;
        });
        setLocalDoctors(filtered);
      } else {
        setLocalDoctors(realDoctors);
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
          <Alert severity="info">
            No doctors found in your city. Check Find Doctors tab to see doctors in other cities.
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