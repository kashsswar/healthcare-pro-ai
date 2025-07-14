import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, Chip, Button, 
  Avatar, TextField, InputAdornment, Accordion, AccordionSummary, AccordionDetails,
  Autocomplete, FormControl
} from '@mui/material';
import { Search, ExpandMore, Star, Verified, Schedule, LocationOn, FilterList } from '@mui/icons-material';
import axios from 'axios';

const PatientDoctorSearch = ({ onBookAppointment }) => {
  const [doctorsBySpec, setDoctorsBySpec] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSpecs, setFilteredSpecs] = useState({});
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  const [availableSpecs, setAvailableSpecs] = useState([]);

  useEffect(() => {
    fetchDoctorsBySpecialization();
  }, []);

  useEffect(() => {
    filterSpecializations();
  }, [searchTerm, doctorsBySpec, selectedSpecialization]);

  useEffect(() => {
    setAvailableSpecs(Object.keys(doctorsBySpec));
  }, [doctorsBySpec]);

  const fetchDoctorsBySpecialization = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/doctors/by-specialization`);
      setDoctorsBySpec(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const filterSpecializations = () => {
    let filtered = { ...doctorsBySpec };

    // Filter by selected specialization
    if (selectedSpecialization) {
      filtered = { [selectedSpecialization]: doctorsBySpec[selectedSpecialization] || [] };
    }

    // Filter by search term
    if (searchTerm) {
      const searchFiltered = {};
      Object.entries(filtered).forEach(([spec, doctors]) => {
        if (spec.toLowerCase().includes(searchTerm.toLowerCase()) || 
            doctors.some(doc => doc.userId.name.toLowerCase().includes(searchTerm.toLowerCase()))) {
          searchFiltered[spec] = doctors.filter(doc => 
            doc.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            spec.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
      });
      filtered = searchFiltered;
    }

    setFilteredSpecs(filtered);
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
      <Typography variant="h4" gutterBottom>🔍 Find Your Doctor</Typography>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Search by doctor name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            options={availableSpecs}
            value={selectedSpecialization}
            onChange={(event, newValue) => setSelectedSpecialization(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Filter by specialization..."
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterList />
                    </InputAdornment>
                  ),
                }}
              />
            )}
            isClearable
          />
        </Grid>
      </Grid>
      
      {Object.entries(filteredSpecs).map(([specialization, doctors]) => (
        <Accordion key={specialization} defaultExpanded={Object.keys(filteredSpecs).length <= 3}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">
              {specialization} ({doctors.length} doctor{doctors.length !== 1 ? 's' : ''})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {doctors.map((doctor) => (
                <Grid item xs={12} md={6} lg={4} key={doctor._id}>
                  <Card 
                    sx={{ 
                      position: 'relative',
                      border: doctor.isFeatured ? '2px solid gold' : 'none',
                      boxShadow: doctor.isFeatured ? '0 4px 20px rgba(255,215,0,0.3)' : 'default',
                      '&:hover': { boxShadow: 6 }
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
                          {doctor.userId.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6">
                            Dr. {doctor.userId.name}
                            {doctor.isVerified && <Verified color="primary" sx={{ ml: 1, fontSize: 16 }} />}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {doctor.qualification.join(', ') || 'Medical Professional'}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Star color="warning" />
                          <Typography variant="body1" fontWeight="bold">
                            {doctor.finalRating || doctor.rating || 4.5}/5
                          </Typography>
                          {doctor.adminBoostRating > 0 && (
                            <Chip label={`+${doctor.adminBoostRating} Boost`} color="secondary" size="small" />
                          )}
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <LocationOn fontSize="small" color="action" />
                          <Typography variant="body2" color="textSecondary">
                            {doctor.experience} years experience • {doctor.location?.city || 'Available Online'}
                          </Typography>
                        </Box>
                        
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
                        startIcon={<Schedule />}
                        onClick={() => onBookAppointment && onBookAppointment(doctor)}
                      >
                        {doctor.availability.isAvailable ? 'Book Appointment' : 'Schedule Later'}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
      
      {Object.keys(filteredSpecs).length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="textSecondary">
            No doctors found matching your search
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Try searching with different keywords
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PatientDoctorSearch;