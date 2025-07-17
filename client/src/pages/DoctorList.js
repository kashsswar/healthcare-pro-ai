import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Card, CardContent, Typography, Button, 
  TextField, Chip, Rating, Box, InputAdornment 
} from '@mui/material';
import { Search, LocationOn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { doctorAPI } from '../services/api';
import { useLanguage } from '../App';
import ShareDoctor from '../components/ShareDoctor';
import DoctorCategories from '../components/DoctorCategories';

function DoctorList({ user }) {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [shareDoctor, setShareDoctor] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    loadDoctors();
  }, []);

  const filterDoctors = React.useCallback(() => {
    if (!searchTerm) {
      setFilteredDoctors(doctors);
      return;
    }

    const filtered = doctors.filter(doctor => 
      doctor.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.location?.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [searchTerm, doctors]);

  useEffect(() => {
    filterDoctors();
  }, [searchTerm, doctors, filterDoctors]);

  const loadDoctors = async (category = null) => {
    try {
      setLoading(true);
      const response = await fetch('/api/doctors');
      const data = await response.json();
      
      if (category) {
        // Filter doctors by selected category/specialization
        const filtered = data.filter(doctor => 
          doctor.specialization === category
        );
        setDoctors(filtered);
        setFilteredDoctors(filtered);
      } else {
        setDoctors(data);
        setFilteredDoctors(data);
      }
    } catch (error) {
      console.error('Error loading doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAISearch = async () => {
    if (!symptoms.trim()) return;
    
    try {
      setLoading(true);
      const response = await doctorAPI.getAll({ symptoms: symptoms });
      setFilteredDoctors(response.data);
    } catch (error) {
      console.error('AI search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('findDoctor')}
      </Typography>
      
      <DoctorCategories 
        onCategorySelect={(category) => {
          setSelectedCategory(category);
          loadDoctors(category);
        }}
        selectedCategory={selectedCategory}
      />
      
      {/* Search and AI Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder={t('searchPlaceholder')}
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
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder={t('symptomsPlaceholder')}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            helperText={t('symptomsHelper')}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Button 
            fullWidth 
            variant="contained" 
            onClick={handleAISearch}
            disabled={!symptoms.trim() || loading}
            sx={{ height: '56px' }}
          >
{t('aiSearch')}
          </Button>
        </Grid>
      </Grid>

      {/* Doctor Cards */}
      <Grid container spacing={3}>
        {filteredDoctors.map((doctor) => (
          <Grid item xs={12} md={6} lg={4} key={doctor._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Doctor {doctor.userId?.name}
                </Typography>
                
                <Chip 
                  label={doctor.specialization} 
                  color="primary" 
                  size="small" 
                  sx={{ mb: 2 }}
                />
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={doctor.rating} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({doctor.reviewCount} reviews)
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  Experience: {doctor.experience} years
                </Typography>
                
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  Fee: ₹{doctor.consultationFee}
                </Typography>
                
                {doctor.location?.city && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                      {doctor.location.city}
                    </Typography>
                  </Box>
                )}
                
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Avg. consultation: {doctor.avgConsultationTime} min
                </Typography>
                
                {doctor.aiMatch && (
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={`${Math.round(doctor.aiMatch.matchScore * 100)}% AI Match`}
                      color="success"
                      size="small"
                    />
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      {doctor.aiMatch.reasoning}
                    </Typography>
                  </Box>
                )}
                
                {doctor.isVerified && (
                  <Chip label="Verified" color="success" size="small" sx={{ mb: 2 }} />
                )}
              </CardContent>
              
              <Box sx={{ p: 2, pt: 0 }}>
                <Button 
                  fullWidth 
                  variant="contained"
                  onClick={() => navigate(`/book-appointment/${doctor._id}`)}
                  sx={{ mb: 1 }}
                >
                  {t('bookAppointment')}
                </Button>
                <Button 
                  fullWidth 
                  variant="outlined"
                  onClick={() => setShareDoctor(doctor)}
                  size="small"
                >
                  📱 Share Doctor
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <ShareDoctor 
        doctor={shareDoctor} 
        open={!!shareDoctor} 
        onClose={() => setShareDoctor(null)} 
      />
      
      {filteredDoctors.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="textSecondary">
            No doctors found matching your criteria
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Try adjusting your search terms or symptoms
          </Typography>
        </Box>
      )}
    </Container>
  );
}

export default DoctorList;