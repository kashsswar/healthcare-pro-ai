import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Card, CardContent, Typography, Button, 
  TextField, Chip, Rating, Box, InputAdornment 
} from '@mui/material';
import { Search, LocationOn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { doctorAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import ShareDoctor from '../components/ShareDoctor';
import DoctorCategories from '../components/DoctorCategories';
import PatientReview from '../components/PatientReview';
import QuickBookingForm from '../components/QuickBookingForm';

function DoctorList({ user }) {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [shareDoctor, setShareDoctor] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [reviewDialog, setReviewDialog] = useState({ open: false, doctor: null });
  const [bookingDialog, setBookingDialog] = useState({ open: false, doctor: null });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    loadDoctors();
    
    // Auto-refresh when profiles change
    const handleRefresh = () => {
      console.log('Auto-refreshing doctor list...');
      setRefreshTrigger(prev => prev + 1);
      loadDoctors(selectedCategory);
    };
    
    window.addEventListener('doctorProfileUpdated', handleRefresh);
    window.addEventListener('adminRatingUpdated', handleRefresh);
    window.addEventListener('storage', handleRefresh);
    
    return () => {
      window.removeEventListener('doctorProfileUpdated', handleRefresh);
      window.removeEventListener('adminRatingUpdated', handleRefresh);
      window.removeEventListener('storage', handleRefresh);
    };
  }, [selectedCategory]);

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
      
      // Get real doctors from localStorage profiles
      const realDoctors = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('doctor_') && key.endsWith('_profile')) {
          try {
            const doctorProfile = JSON.parse(localStorage.getItem(key));
            const doctorId = key.replace('doctor_', '').replace('_profile', '');
            
            if (doctorProfile.city && doctorProfile.specialization) {
              // Get admin rating boost
              const adminBoosts = JSON.parse(localStorage.getItem('adminRatingBoosts') || '[]');
              const boost = adminBoosts.find(b => b.doctorId === doctorId) || { boostAmount: 0 };
              
              // Get reviews
              const reviews = JSON.parse(localStorage.getItem('doctorReviews') || '[]');
              const doctorReviews = reviews.filter(r => r.doctorId === doctorId);
              const avgRating = doctorReviews.length > 0 
                ? doctorReviews.reduce((sum, r) => sum + r.rating, 0) / doctorReviews.length 
                : 4.5;
              
              realDoctors.push({
                _id: doctorId,
                userId: { name: doctorProfile.name || 'Doctor' },
                specialization: doctorProfile.specialization,
                experience: parseInt(doctorProfile.experience) || 5,
                consultationFee: parseInt(doctorProfile.consultationFee) || 500,
                rating: avgRating,
                finalRating: Math.min(5.0, avgRating + (boost.boostAmount || 0)),
                reviewCount: doctorReviews.length,
                location: { 
                  city: doctorProfile.city.trim(), 
                  address: `${doctorProfile.flatNo || ''} ${doctorProfile.street || ''}, ${doctorProfile.city}`.trim().replace(/^,\s*/, '')
                },
                avgConsultationTime: 30,
                isVerified: true,
                adminBoostRating: boost.boostAmount || 0
              });
            }
          } catch (error) {
            console.log('Error parsing doctor profile:', error);
          }
        }
      }
      
      // Mock doctors as fallback
      const mockDoctors = [
        {
          _id: 'mock1',
          userId: { name: 'Rajesh Kumar' },
          specialization: 'General Medicine',
          experience: 10,
          consultationFee: 500,
          rating: 4.5,
          finalRating: 4.5,
          reviewCount: 25,
          location: { city: 'Mumbai' },
          avgConsultationTime: 30,
          isVerified: true
        },
        {
          _id: 'mock2',
          userId: { name: 'Priya Sharma' },
          specialization: 'Cardiology',
          experience: 15,
          consultationFee: 800,
          rating: 4.8,
          finalRating: 4.8,
          reviewCount: 40,
          location: { city: 'Mumbai' },
          avgConsultationTime: 45,
          isVerified: true
        },
        {
          _id: 'mock3',
          userId: { name: 'Amit Patel' },
          specialization: 'Dermatology',
          experience: 8,
          consultationFee: 600,
          rating: 4.3,
          finalRating: 4.3,
          reviewCount: 18,
          location: { city: 'Delhi' },
          avgConsultationTime: 25,
          isVerified: true
        }
      ];
      
      // Combine real and mock doctors
      const data = [...realDoctors, ...mockDoctors];
      
      if (category) {
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
      setDoctors([]);
      setFilteredDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAISearch = async () => {
    if (!symptoms.trim()) return;
    
    try {
      setLoading(true);
      
      // AI-based symptom to specialization mapping
      const symptomSpecializationMap = {
        'fever': ['General Medicine', 'Pediatrics'],
        'headache': ['General Medicine', 'Neurology'],
        'chest pain': ['Cardiology', 'General Medicine'],
        'skin': ['Dermatology'],
        'rash': ['Dermatology'],
        'heart': ['Cardiology'],
        'stomach': ['General Medicine', 'Gastroenterology'],
        'eye': ['Ophthalmology'],
        'ear': ['ENT'],
        'throat': ['ENT'],
        'bone': ['Orthopedics'],
        'joint': ['Orthopedics'],
        'child': ['Pediatrics'],
        'pregnancy': ['Gynecology'],
        'mental': ['Psychiatry'],
        'depression': ['Psychiatry'],
        'anxiety': ['Psychiatry']
      };
      
      // Find relevant specializations based on symptoms
      const symptomsLower = symptoms.toLowerCase();
      let relevantSpecializations = [];
      
      Object.keys(symptomSpecializationMap).forEach(symptom => {
        if (symptomsLower.includes(symptom)) {
          relevantSpecializations.push(...symptomSpecializationMap[symptom]);
        }
      });
      
      // Remove duplicates
      relevantSpecializations = [...new Set(relevantSpecializations)];
      
      // If no specific specialization found, default to General Medicine
      if (relevantSpecializations.length === 0) {
        relevantSpecializations = ['General Medicine'];
      }
      
      // Filter doctors by relevant specializations
      const aiFilteredDoctors = doctors.filter(doctor => 
        relevantSpecializations.includes(doctor.specialization)
      ).map(doctor => ({
        ...doctor,
        aiMatch: {
          matchScore: 0.8 + Math.random() * 0.2, // 80-100% match
          reasoning: `Recommended for ${symptoms} based on specialization in ${doctor.specialization}`
        }
      }));
      
      // Sort by AI match score
      aiFilteredDoctors.sort((a, b) => b.aiMatch.matchScore - a.aiMatch.matchScore);
      
      setFilteredDoctors(aiFilteredDoctors);
      
    } catch (error) {
      console.error('AI search error:', error);
      // Fallback to regular search if AI fails
      filterDoctors();
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
                  <Rating value={doctor.finalRating || doctor.rating} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {(doctor.finalRating || doctor.rating || 0).toFixed(1)} ({doctor.reviewCount || 0} reviews)
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
                  onClick={() => setBookingDialog({ open: true, doctor })}
                  sx={{ mb: 1 }}
                >
                  {t('bookAppointment')}
                </Button>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    variant="outlined"
                    onClick={() => setShareDoctor(doctor)}
                    size="small"
                    sx={{ flex: 1 }}
                  >
                    📱 Share
                  </Button>
                  <Button 
                    variant="outlined"
                    color="warning"
                    onClick={() => setReviewDialog({ open: true, doctor })}
                    size="small"
                    sx={{ flex: 1 }}
                  >
                    ⭐ Review
                  </Button>
                </Box>
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
      
      <PatientReview
        open={reviewDialog.open}
        onClose={() => setReviewDialog({ open: false, doctor: null })}
        doctor={reviewDialog.doctor}
        patient={user}
        onReviewSubmit={(reviewData, newRating) => {
          // Update the doctor's rating in the current list
          setDoctors(prev => prev.map(d => 
            d._id === reviewData.doctorId 
              ? { ...d, rating: newRating, finalRating: newRating + (d.adminBoostRating || 0) }
              : d
          ));
          setFilteredDoctors(prev => prev.map(d => 
            d._id === reviewData.doctorId 
              ? { ...d, rating: newRating, finalRating: newRating + (d.adminBoostRating || 0) }
              : d
          ));
        }}
      />
      
      <QuickBookingForm
        open={bookingDialog.open}
        onClose={() => setBookingDialog({ open: false, doctor: null })}
        doctor={bookingDialog.doctor}
        patient={user}
        onBookingConfirm={(appointmentData) => {
          console.log('Appointment booked from doctor list:', appointmentData);
        }}
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