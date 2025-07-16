import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Avatar, Box, TextField, Select, MenuItem,
  FormControl, InputLabel, Button, Grid, Alert
} from '@mui/material';
import { Star, LocationOn, TrendingUp, Verified, Search } from '@mui/icons-material';
import axios from 'axios';

const AdminDoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [locations, setLocations] = useState([]);
  const [specializations, setSpecializations] = useState([]);

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    filterAndSortDoctors();
  }, [doctors, searchTerm, locationFilter, specializationFilter, sortBy]);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/doctors');
      setDoctors(response.data);
      
      // Extract unique locations and specializations
      const uniqueLocations = [...new Set(response.data.map(d => d.location?.city).filter(Boolean))];
      const uniqueSpecs = [...new Set(response.data.map(d => d.specialization))];
      
      setLocations(uniqueLocations);
      setSpecializations(uniqueSpecs);
    } catch (error) {
      console.error('Error loading doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortDoctors = () => {
    let filtered = [...doctors];

    // Apply filters
    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(doctor => doctor.location?.city === locationFilter);
    }

    if (specializationFilter) {
      filtered = filtered.filter(doctor => doctor.specialization === specializationFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.finalRating || b.rating || 0) - (a.finalRating || a.rating || 0);
        case 'experience':
          return (b.experience || 0) - (a.experience || 0);
        case 'fee':
          return (b.consultationFee || 0) - (a.consultationFee || 0);
        case 'name':
          return (a.userId?.name || '').localeCompare(b.userId?.name || '');
        default:
          return 0;
      }
    });

    setFilteredDoctors(filtered);
  };

  const getRankingPosition = (doctor) => {
    const sortedByRating = [...doctors].sort((a, b) => 
      (b.finalRating || b.rating || 0) - (a.finalRating || a.rating || 0)
    );
    return sortedByRating.findIndex(d => d._id === doctor._id) + 1;
  };

  const getLocationRanking = (doctor) => {
    const sameLocationDoctors = doctors.filter(d => d.location?.city === doctor.location?.city);
    const sortedByRating = sameLocationDoctors.sort((a, b) => 
      (b.finalRating || b.rating || 0) - (a.finalRating || a.rating || 0)
    );
    return sortedByRating.findIndex(d => d._id === doctor._id) + 1;
  };

  const getSpecializationRanking = (doctor) => {
    const sameSpecDoctors = doctors.filter(d => d.specialization === doctor.specialization);
    const sortedByRating = sameSpecDoctors.sort((a, b) => 
      (b.finalRating || b.rating || 0) - (a.finalRating || a.rating || 0)
    );
    return sortedByRating.findIndex(d => d._id === doctor._id) + 1;
  };

  if (loading) return <Typography>Loading doctors...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        👨‍⚕️ Doctors Ranking & Analytics
      </Typography>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  label="Location"
                >
                  <MenuItem value="">All Locations</MenuItem>
                  {locations.map(location => (
                    <MenuItem key={location} value={location}>{location}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Specialization</InputLabel>
                <Select
                  value={specializationFilter}
                  onChange={(e) => setSpecializationFilter(e.target.value)}
                  label="Specialization"
                >
                  <MenuItem value="">All Specializations</MenuItem>
                  {specializations.map(spec => (
                    <MenuItem key={spec} value={spec}>{spec}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort By"
                >
                  <MenuItem value="rating">Rating</MenuItem>
                  <MenuItem value="experience">Experience</MenuItem>
                  <MenuItem value="fee">Fee</MenuItem>
                  <MenuItem value="name">Name</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={loadDoctors}
                sx={{ height: '56px' }}
              >
                🔄 Refresh
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">{doctors.length}</Typography>
              <Typography variant="body2">Total Doctors</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">{locations.length}</Typography>
              <Typography variant="body2">Cities Covered</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">{specializations.length}</Typography>
              <Typography variant="body2">Specializations</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {(doctors.reduce((acc, d) => acc + (d.finalRating || d.rating || 0), 0) / doctors.length || 0).toFixed(1)}
              </Typography>
              <Typography variant="body2">Avg Rating</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Doctors Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Doctors List ({filteredDoctors.length})
          </Typography>
          
          {filteredDoctors.length === 0 ? (
            <Alert severity="info">
              {doctors.length === 0 
                ? "No doctors registered yet. Share the registration link!"
                : "No doctors match your current filters."
              }
            </Alert>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'primary.light' }}>
                    <TableCell><strong>Rank</strong></TableCell>
                    <TableCell><strong>Doctor</strong></TableCell>
                    <TableCell><strong>Specialization</strong></TableCell>
                    <TableCell><strong>Location</strong></TableCell>
                    <TableCell><strong>Rating</strong></TableCell>
                    <TableCell><strong>Experience</strong></TableCell>
                    <TableCell><strong>Fee</strong></TableCell>
                    <TableCell><strong>Rankings</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDoctors.map((doctor, index) => (
                    <TableRow key={doctor._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="h6" color="primary">
                            #{index + 1}
                          </Typography>
                          {index < 3 && (
                            <Chip 
                              label={index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} 
                              size="small" 
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                            {doctor.userId?.name?.charAt(0) || 'D'}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">
                              Dr. {doctor.userId?.name || 'Unknown'}
                              {doctor.isVerified && <Verified color="primary" sx={{ ml: 1, fontSize: 16 }} />}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {doctor.qualification?.join(', ') || 'Medical Professional'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Chip label={doctor.specialization} color="primary" size="small" />
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOn fontSize="small" color="action" />
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {doctor.location?.city || 'Online'}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Star color="warning" fontSize="small" />
                          <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 'bold' }}>
                            {(doctor.finalRating || doctor.rating || 0).toFixed(1)}
                          </Typography>
                          {doctor.adminBoostRating > 0 && (
                            <Chip 
                              label={`+${doctor.adminBoostRating}`} 
                              color="secondary" 
                              size="small" 
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">
                          {doctor.experience || 0} years
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" fontWeight="bold" color="success.main">
                          ₹{doctor.consultationFee || 0}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Box>
                          <Chip 
                            label={`Overall: #${getRankingPosition(doctor)}`} 
                            size="small" 
                            sx={{ mb: 0.5, display: 'block' }}
                          />
                          <Chip 
                            label={`${doctor.location?.city || 'Online'}: #${getLocationRanking(doctor)}`} 
                            size="small" 
                            color="info"
                            sx={{ mb: 0.5, display: 'block' }}
                          />
                          <Chip 
                            label={`${doctor.specialization}: #${getSpecializationRanking(doctor)}`} 
                            size="small" 
                            color="success"
                          />
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box>
                          {doctor.isFeatured && (
                            <Chip label="⭐ Featured" color="warning" size="small" sx={{ mb: 0.5, display: 'block' }} />
                          )}
                          {doctor.availability?.isAvailable ? (
                            <Chip label="🟢 Available" color="success" size="small" />
                          ) : (
                            <Chip label="🔴 Busy" color="error" size="small" />
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminDoctorsList;