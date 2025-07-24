import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Table, TableBody, TableCell, 
  TableHead, TableRow, Chip, Button, Select, MenuItem, FormControl, InputLabel, Box
} from '@mui/material';
import { TrendingUp, LocationOn, Star } from '@mui/icons-material';
import axios from 'axios';

function AdminDoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    loadDoctors();
    
    // Auto-refresh when data changes
    const handleRefresh = () => {
      console.log('Auto-refreshing doctors list...');
      setRefreshTrigger(prev => prev + 1);
      loadDoctors();
    };
    
    window.addEventListener('doctorProfileUpdated', handleRefresh);
    window.addEventListener('adminRatingUpdated', handleRefresh);
    window.addEventListener('appointmentUpdated', handleRefresh);
    window.addEventListener('storage', handleRefresh);
    
    return () => {
      window.removeEventListener('doctorProfileUpdated', handleRefresh);
      window.removeEventListener('adminRatingUpdated', handleRefresh);
      window.removeEventListener('appointmentUpdated', handleRefresh);
      window.removeEventListener('storage', handleRefresh);
    };
  }, []);

  useEffect(() => {
    filterAndSortDoctors();
  }, [doctors, filterBy, sortBy]);

  const loadDoctors = async () => {
    try {
      // Get real doctors from localStorage
      const realDoctors = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('doctor_') && key.endsWith('_profile')) {
          try {
            const doctorProfile = JSON.parse(localStorage.getItem(key));
            const doctorId = key.replace('doctor_', '').replace('_profile', '');
            
            if (doctorProfile.specialization) {
              // Get admin rating boost
              const adminBoosts = JSON.parse(localStorage.getItem('adminRatingBoosts') || '[]');
              const boost = adminBoosts.find(b => b.doctorId === doctorId) || { boostAmount: 0 };
              
              // Get patient reviews
              const reviews = JSON.parse(localStorage.getItem('doctorReviews') || '[]');
              const doctorReviews = reviews.filter(r => r.doctorId === doctorId);
              const avgRating = doctorReviews.length > 0 
                ? doctorReviews.reduce((sum, r) => sum + r.rating, 0) / doctorReviews.length 
                : 4.5;
              
              // Calculate patient count and earnings
              const appointments = JSON.parse(localStorage.getItem('bookedAppointments') || '[]');
              const doctorAppointments = appointments.filter(apt => 
                (apt.doctorId === doctorId || apt.doctor === doctorId) && 
                apt.status === 'completed'
              );
              
              const totalPatients = doctorAppointments.length;
              const monthlyEarnings = doctorAppointments.reduce((total, apt) => {
                const fee = apt.consultationFee || parseInt(doctorProfile.consultationFee) || 500;
                return total + fee;
              }, 0);
              
              realDoctors.push({
                _id: doctorId,
                userId: { name: doctorProfile.name || 'Doctor' },
                specialization: doctorProfile.specialization,
                experience: parseInt(doctorProfile.experience) || 1,
                consultationFee: parseInt(doctorProfile.consultationFee) || 500,
                rating: avgRating,
                finalRating: Math.min(5.0, avgRating + (boost.boostAmount || 0)),
                adminBoostRating: boost.boostAmount || 0,
                location: { 
                  city: doctorProfile.city || 'Not specified',
                  address: `${doctorProfile.flatNo || ''} ${doctorProfile.street || ''}, ${doctorProfile.city || 'Not specified'}`.trim().replace(/^,\s*/, '')
                },
                totalPatients,
                monthlyEarnings,
                isVerified: true,
                createdAt: doctorProfile.createdAt || new Date().toISOString()
              });
            }
          } catch (error) {
            console.log('Error parsing doctor profile:', error);
          }
        }
      }
      
      console.log('Real doctors loaded:', realDoctors.length);
      setDoctors(realDoctors);
      
    } catch (error) {
      console.error('Error loading doctors:', error);
      setDoctors([]);
    }
  };

  const filterAndSortDoctors = () => {
    let filtered = [...doctors];

    // Filter by specialization or location
    if (filterBy !== 'all') {
      if (filterBy.startsWith('spec_')) {
        const spec = filterBy.replace('spec_', '');
        filtered = filtered.filter(doc => doc.specialization === spec);
      } else if (filterBy.startsWith('loc_')) {
        const loc = filterBy.replace('loc_', '');
        filtered = filtered.filter(doc => doc.location?.city === loc);
      }
    }

    // Sort doctors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.finalRating || b.rating) - (a.finalRating || a.rating);
        case 'patients':
          return (b.totalPatients || 0) - (a.totalPatients || 0);
        case 'earnings':
          return (b.monthlyEarnings || 0) - (a.monthlyEarnings || 0);
        case 'experience':
          return b.experience - a.experience;
        default:
          return 0;
      }
    });

    setFilteredDoctors(filtered);
  };

  const getUniqueSpecializations = () => {
    return [...new Set(doctors.map(doc => doc.specialization))];
  };

  const getUniqueCities = () => {
    return [...new Set(doctors.map(doc => doc.location?.city).filter(Boolean))];
  };

  const boostDoctor = async (doctorId) => {
    try {
      // Save boost to localStorage
      const boosts = JSON.parse(localStorage.getItem('adminRatingBoosts') || '[]');
      const existingBoostIndex = boosts.findIndex(b => b.doctorId === doctorId);
      
      const newBoost = {
        doctorId,
        boostAmount: 0.5,
        reason: 'Admin boost for better visibility',
        adminId: 'admin_' + Date.now(),
        timestamp: new Date().toISOString()
      };
      
      if (existingBoostIndex >= 0) {
        // Update existing boost
        boosts[existingBoostIndex].boostAmount += 0.5;
        boosts[existingBoostIndex].boostAmount = Math.min(5.0, boosts[existingBoostIndex].boostAmount);
      } else {
        // Add new boost
        boosts.push(newBoost);
      }
      
      localStorage.setItem('adminRatingBoosts', JSON.stringify(boosts));
      
      // Dispatch events for auto-refresh
      window.dispatchEvent(new CustomEvent('adminRatingUpdated', { 
        detail: { doctorId, boost: newBoost } 
      }));
      window.dispatchEvent(new Event('storage'));
      
      loadDoctors();
      alert('Doctor boosted successfully! Rating increased by +0.5');
      
    } catch (error) {
      alert('Error boosting doctor: ' + error.message);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          👨‍⚕️ Doctors Ranking Dashboard ({doctors.length} total)
        </Typography>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Filter By</InputLabel>
            <Select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
              <MenuItem value="all">All Doctors</MenuItem>
              {getUniqueSpecializations().map(spec => (
                <MenuItem key={spec} value={`spec_${spec}`}>📋 {spec}</MenuItem>
              ))}
              {getUniqueCities().map(city => (
                <MenuItem key={city} value={`loc_${city}`}>📍 {city}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Sort By</InputLabel>
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <MenuItem value="rating">⭐ Rating</MenuItem>
              <MenuItem value="patients">👥 Patients</MenuItem>
              <MenuItem value="earnings">💰 Earnings</MenuItem>
              <MenuItem value="experience">🎓 Experience</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Doctors Table */}
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Patients</TableCell>
              <TableCell>Fee</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDoctors.map((doctor, index) => (
              <TableRow key={doctor._id}>
                <TableCell>
                  <Chip 
                    label={`#${index + 1}`} 
                    color={index < 3 ? 'primary' : 'default'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    Doctor {doctor.userId?.name || 'Unknown'}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {doctor.experience} years exp
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={doctor.specialization} size="small" />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOn fontSize="small" />
                    <Typography variant="body2">
                      {doctor.location?.city || 'Not specified'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Star color="warning" fontSize="small" />
                      <Typography variant="body1" fontWeight="bold" sx={{ ml: 0.5 }}>
                        {(doctor.finalRating || doctor.rating || 0).toFixed(1)}
                      </Typography>
                    </Box>
                    {doctor.adminBoostRating > 0 && (
                      <Typography variant="caption" color="secondary.main" sx={{ fontWeight: 'bold' }}>
                        +{doctor.adminBoostRating.toFixed(1)}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {doctor.totalPatients || 0}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    ₹{doctor.consultationFee}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button 
                    size="small" 
                    startIcon={<TrendingUp />}
                    onClick={() => boostDoctor(doctor._id)}
                    variant="outlined"
                  >
                    Boost
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredDoctors.length === 0 && (
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 2 }}>
            No doctors found for the selected filter.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default AdminDoctorsList;