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

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    filterAndSortDoctors();
  }, [doctors, filterBy, sortBy]);

  const loadDoctors = async () => {
    try {
      const response = await axios.get('/api/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error loading doctors:', error);
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
      await axios.post('/api/admin/boost-doctor', {
        doctorId,
        boostType: 'rating',
        boostValue: 0.5,
        reason: 'Admin boost for better visibility',
        adminId: 'admin_001'
      });
      loadDoctors();
      alert('Doctor boosted successfully!');
    } catch (error) {
      alert('Error boosting doctor: ' + error.response?.data?.message);
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
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Star color="warning" fontSize="small" />
                    <Typography variant="body2" fontWeight="bold">
                      {(doctor.finalRating || doctor.rating || 0).toFixed(1)}
                    </Typography>
                    {doctor.adminBoostRating > 0 && (
                      <Chip label={`+${doctor.adminBoostRating}`} size="small" color="secondary" sx={{ ml: 1 }} />
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