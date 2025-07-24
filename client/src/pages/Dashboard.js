import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Card, CardContent, Typography, Button, 
  List, ListItem, ListItemText, Chip, Box, Tab, Tabs 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI, aiAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import PatientDoctorSearch from '../components/PatientDoctorSearch';
import AutoMarketing from '../components/AutoMarketing';
import DoctorAvailabilityToggle from '../components/DoctorAvailabilityToggle';
import DoctorAvailabilityChecker from '../components/DoctorAvailabilityChecker';
import DoctorAppointmentQueue from '../components/DoctorAppointmentQueue';
import DoctorLocationManager from '../components/DoctorLocationManager';
import PatientProfile from '../components/PatientProfile';
import DoctorProfile from '../components/DoctorProfile';
import PatientReview from '../components/PatientReview';
import DoctorsByLocation from '../components/DoctorsByLocation';
import LocalDoctorsList from '../components/LocalDoctorsList';


function Dashboard({ user, socket }) {
  const [appointments, setAppointments] = useState([]);
  const [healthRecommendations, setHealthRecommendations] = useState([]);
  const [queueUpdates, setQueueUpdates] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [reviewDialog, setReviewDialog] = useState({ open: false, doctor: null });
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleBookAppointment = (doctor) => {
    navigate(`/book-appointment/${doctor._id}`);
  };
  
  const getDoctorNameById = (doctorId) => {
    try {
      const doctorProfile = localStorage.getItem(`doctor_${doctorId}_profile`);
      if (doctorProfile) {
        const profile = JSON.parse(doctorProfile);
        return profile.name || 'Doctor';
      }
      
      // Check user data if it's the current doctor
      if (doctorId === user._id || doctorId === user.id) {
        return user.name;
      }
      
      return 'Doctor';
    } catch (error) {
      return 'Doctor';
    }
  };
  
  const getTodayAppointments = () => {
    const bookedAppointments = JSON.parse(localStorage.getItem('bookedAppointments') || '[]');
    const doctorId = user._id || user.id;
    const today = new Date().toDateString();
    
    return bookedAppointments.filter(apt => {
      const aptDate = new Date(apt.scheduledTime).toDateString();
      return (apt.doctorId === doctorId || apt.doctor === doctorId) && 
             aptDate === today && 
             apt.status === 'scheduled';
    }).length;
  };
  
  const getCompletedAppointments = () => {
    const bookedAppointments = JSON.parse(localStorage.getItem('bookedAppointments') || '[]');
    const doctorId = user._id || user.id;
    const today = new Date().toDateString();
    
    return bookedAppointments.filter(apt => {
      const aptDate = new Date(apt.scheduledTime).toDateString();
      return (apt.doctorId === doctorId || apt.doctor === doctorId) && 
             aptDate === today && 
             apt.status === 'completed';
    }).length;
  };
  
  const getTodayEarnings = () => {
    const bookedAppointments = JSON.parse(localStorage.getItem('bookedAppointments') || '[]');
    const doctorId = user._id || user.id;
    const today = new Date().toDateString();
    
    // Get current consultation fee from doctor profile
    const doctorProfile = JSON.parse(localStorage.getItem(`doctor_${doctorId}_profile`) || '{}');
    const currentFee = parseInt(doctorProfile.consultationFee) || 500;
    
    const completedToday = bookedAppointments.filter(apt => {
      const aptDate = new Date(apt.scheduledTime).toDateString();
      return (apt.doctorId === doctorId || apt.doctor === doctorId) && 
             aptDate === today && 
             apt.status === 'completed';
    });
    
    return completedToday.reduce((total, apt) => {
      // Use the fee from appointment or current doctor fee
      const fee = apt.consultationFee || currentFee;
      return total + fee;
    }, 0);
  };
  
  const getTotalEarnings = () => {
    const bookedAppointments = JSON.parse(localStorage.getItem('bookedAppointments') || '[]');
    const cancelledAppointments = JSON.parse(localStorage.getItem('cancelledAppointments') || '[]');
    const doctorId = user._id || user.id;
    
    // Get current consultation fee from doctor profile
    const doctorProfile = JSON.parse(localStorage.getItem(`doctor_${doctorId}_profile`) || '{}');
    const currentFee = parseInt(doctorProfile.consultationFee) || 500;
    
    // Calculate earnings from completed appointments
    const completedAppointments = bookedAppointments.filter(apt => 
      (apt.doctorId === doctorId || apt.doctor === doctorId) && 
      apt.status === 'completed'
    );
    
    const totalEarned = completedAppointments.reduce((total, apt) => {
      const fee = apt.consultationFee || currentFee;
      return total + fee;
    }, 0);
    
    // Calculate refunds from cancelled appointments
    const doctorCancellations = cancelledAppointments.filter(apt => 
      apt.doctorId === doctorId || apt.doctor === doctorId
    );
    
    const totalRefunded = doctorCancellations.reduce((total, apt) => {
      return total + (apt.refundAmount || apt.consultationFee || currentFee);
    }, 0);
    
    return {
      totalEarned,
      totalRefunded,
      netEarnings: totalEarned - totalRefunded,
      completedCount: completedAppointments.length,
      cancelledCount: doctorCancellations.length
    };
  };
  
  const getRealRating = () => {
    const reviews = JSON.parse(localStorage.getItem('doctorReviews') || '[]');
    const doctorId = user._id || user.id;
    
    const doctorReviews = reviews.filter(review => review.doctorId === doctorId);
    const adminBoost = getAdminBoost();
    
    if (doctorReviews.length === 0) {
      // Show default rating + admin boost if no patient reviews
      const defaultRating = 4.5;
      return Math.min(5.0, defaultRating + adminBoost).toFixed(1);
    }
    
    const avgRating = doctorReviews.reduce((sum, review) => sum + review.rating, 0) / doctorReviews.length;
    return Math.min(5.0, avgRating + adminBoost).toFixed(1);
  };
  
  const getAdminBoost = () => {
    const doctorId = user._id || user.id;
    
    // Check multiple possible localStorage keys for admin boosts
    const adminBoosts = JSON.parse(localStorage.getItem('adminRatingBoosts') || '[]');
    const doctorBoosts = JSON.parse(localStorage.getItem('doctorBoosts') || '[]');
    const ratingBoosts = JSON.parse(localStorage.getItem('ratingBoosts') || '[]');
    
    // Check all possible boost sources
    let boost = adminBoosts.find(b => b.doctorId === doctorId || b.doctor === doctorId);
    if (!boost) boost = doctorBoosts.find(b => b.doctorId === doctorId || b.doctor === doctorId);
    if (!boost) boost = ratingBoosts.find(b => b.doctorId === doctorId || b.doctor === doctorId);
    
    // Check direct doctor boost property
    const doctorData = JSON.parse(localStorage.getItem(`doctor_${doctorId}`) || '{}');
    if (doctorData.adminBoostRating) {
      return doctorData.adminBoostRating;
    }
    
    console.log('Admin boost found:', boost);
    return boost ? (boost.boostAmount || boost.rating || boost.boost || 0) : 0;
  };

  const loadDashboardData = React.useCallback(async () => {
    try {
      // Load appointments from localStorage
      const bookedAppointments = JSON.parse(localStorage.getItem('bookedAppointments') || '[]');
      const userAppointments = bookedAppointments.filter(apt => {
        console.log('Checking appointment for patient:', apt.patient?.email, apt.patientId);
        console.log('Current user:', user.email, user.id, user._id);
        return apt.patient?.email === user.email || 
               apt.patientId === user.id || 
               apt.patientId === user._id;
      });
      
      console.log('User appointments found:', userAppointments.length);
      
      // Ensure appointments have proper status
      const processedAppointments = userAppointments.map(apt => ({
        ...apt,
        status: apt.status || 'scheduled',
        doctorName: apt.doctorName || apt.doctor?.userId?.name || apt.doctor?.name || getDoctorNameById(apt.doctorId) || 'Doctor'
      }));
      
      setAppointments(processedAppointments);
      console.log('Loaded appointments:', processedAppointments);
      
    } catch (error) {
      console.error('Dashboard load error:', error);
      setAppointments([]);
    }
  }, [user.id, user.email]);

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  useEffect(() => {
    loadDashboardData();
    // Reset to main dashboard tab when component mounts
    setActiveTab(0);
    
    // Auto-refresh system for all profile changes
    const handleRefresh = () => {
      console.log('Auto-refreshing dashboard data...');
      setRefreshTrigger(prev => prev + 1);
      loadDashboardData();
    };
    
    // Listen for all types of profile updates
    window.addEventListener('doctorProfileUpdated', handleRefresh);
    window.addEventListener('patientProfileUpdated', handleRefresh);
    window.addEventListener('adminRatingUpdated', handleRefresh);
    window.addEventListener('appointmentUpdated', handleRefresh);
    window.addEventListener('storage', handleRefresh);
    
    // Periodic auto-refresh every 30 seconds
    const autoRefreshInterval = setInterval(handleRefresh, 30000);
    
    return () => {
      window.removeEventListener('doctorProfileUpdated', handleRefresh);
      window.removeEventListener('patientProfileUpdated', handleRefresh);
      window.removeEventListener('adminRatingUpdated', handleRefresh);
      window.removeEventListener('appointmentUpdated', handleRefresh);
      window.removeEventListener('storage', handleRefresh);
      clearInterval(autoRefreshInterval);
    };
  }, [loadDashboardData]);

  const getStatusColor = (status) => {
    const colors = {
      'scheduled': 'primary',
      'in-progress': 'warning',
      'completed': 'success',
      'cancelled': 'error'
    };
    return colors[status] || 'default';
  };
  
  const cancelPatientAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment? You will receive a full refund.')) {
      return;
    }
    
    try {
      // Remove from local appointments
      setAppointments(prev => prev.filter(apt => apt._id !== appointmentId));
      
      // Update localStorage
      const bookedAppointments = JSON.parse(localStorage.getItem('bookedAppointments') || '[]');
      const cancelledAppointment = bookedAppointments.find(apt => apt._id === appointmentId);
      const updatedAppointments = bookedAppointments.filter(apt => apt._id !== appointmentId);
      localStorage.setItem('bookedAppointments', JSON.stringify(updatedAppointments));
      
      // Add to cancelled appointments
      const cancelledAppointments = JSON.parse(localStorage.getItem('cancelledAppointments') || '[]');
      if (cancelledAppointment) {
        cancelledAppointments.push({
          ...cancelledAppointment,
          status: 'cancelled',
          cancelledAt: new Date(),
          refundAmount: 500
        });
        localStorage.setItem('cancelledAppointments', JSON.stringify(cancelledAppointments));
      }
      
      // Dispatch auto-refresh events
      window.dispatchEvent(new CustomEvent('appointmentUpdated', { 
        detail: { type: 'cancelled', appointmentId } 
      }));
      window.dispatchEvent(new Event('storage'));
      
      // Simulate refund notification
      alert('Appointment cancelled successfully! ₹500 has been refunded to your account. It will reflect in 2-3 business days.');
      
      // Reload dashboard data
      loadDashboardData();
      
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      alert('Failed to cancel appointment. Please try again.');
    }
  };

  const upcomingAppointments = appointments.filter(apt => {
    const now = new Date();
    const appointmentTime = new Date(apt.scheduledTime);
    const isUpcoming = appointmentTime > now;
    const isScheduled = apt.status === 'scheduled' || apt.status === 'pending';
    
    console.log('Filtering appointment:', {
      status: apt.status,
      scheduledTime: apt.scheduledTime,
      appointmentTime: appointmentTime.toLocaleString(),
      now: now.toLocaleString(),
      isUpcoming,
      isScheduled,
      willShow: isUpcoming && isScheduled
    });
    
    return isUpcoming && isScheduled;
  });
  
  console.log('Upcoming appointments:', upcomingAppointments.length);

  if (user.role === 'doctor') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          👨‍⚕️ Dr. {user.name} - {t('home')}
        </Typography>
        
        {/* Doctor Profile */}
        <DoctorProfile user={user} />
        
        {/* Doctor Availability Toggle */}
        <DoctorAvailabilityToggle user={{...user, doctorId: user._id || user.id}} socket={socket} />
        
        {/* Doctor Appointment Queue */}
        <DoctorAppointmentQueue user={{...user, doctorId: user._id || user.id}} socket={socket} />
        
        {/* Doctor Location Manager */}
        <DoctorLocationManager user={{...user, doctorId: user._id || user.id}} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📋 Today's Summary
                </Typography>
                <Typography variant="h4" color="primary">{getTodayAppointments()}</Typography>
                <Typography variant="body2">Scheduled Appointments</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  💰 Today's Earnings
                </Typography>
                <Typography variant="h4" color="success.main">₹{getTodayEarnings()}</Typography>
                <Typography variant="body2">From {getCompletedAppointments()} consultations</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📊 Total Earnings Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Typography variant="h5" color="success.main">₹{getTotalEarnings().totalEarned}</Typography>
                    <Typography variant="body2">Total Earned ({getTotalEarnings().completedCount} patients)</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="h5" color="error.main">₹{getTotalEarnings().totalRefunded}</Typography>
                    <Typography variant="body2">Total Refunded ({getTotalEarnings().cancelledCount} cancellations)</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="h5" color="primary.main">₹{getTotalEarnings().netEarnings}</Typography>
                    <Typography variant="body2">Net Earnings</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="h5" color="info.main">₹{JSON.parse(localStorage.getItem(`doctor_${user._id || user.id}_profile`) || '{}').consultationFee || 500}</Typography>
                    <Typography variant="body2">Current Fee/Patient</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ⭐ Your Rating
                </Typography>
                <Typography variant="h4" color="warning.main">{getRealRating()}</Typography>
                <Typography variant="body2">
                  {getAdminBoost() > 0 ? `Admin Boosted (+${getAdminBoost()})` : 'Based on patient reviews'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('welcome')}, {user.name}! 🙏
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Dashboard" />
          <Tab label="Find Doctors" />
        </Tabs>
      </Box>
      
      {activeTab === 1 ? (
        <Box>
          <Typography variant="h5" gutterBottom>
            🔍 Find Doctors Near You
          </Typography>
          <DoctorsByLocation user={user} onBookAppointment={(appointmentData) => {
            // Refresh dashboard data when appointment is booked
            loadDashboardData();
          }} />
        </Box>
      ) : (
      <Grid container spacing={3}>
        {/* Patient Profile */}
        <Grid item xs={12}>
          <PatientProfile user={user} />
        </Grid>
        
        {/* Local Doctors List */}
        <Grid item xs={12}>
          <LocalDoctorsList user={user} onBookAppointment={handleBookAppointment} />
        </Grid>
        
        {/* Doctor Availability Checker */}
        <Grid item xs={12}>
          <DoctorAvailabilityChecker />
        </Grid>
        
        {/* AI Auto-Marketing */}
        <Grid item xs={12}>
          <AutoMarketing />
        </Grid>
        

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>{t('quickActions')}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/doctors')}
                  fullWidth
                >
                  {t('findDoctor')}
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/health-recommendations')}
                  fullWidth
                >
                  {t('healthTips')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Appointments */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('upcomingAppointments')} ({upcomingAppointments.length})
              </Typography>
              {upcomingAppointments.length === 0 ? (
                <Typography color="textSecondary">
                  {t('noAppointments')}
                </Typography>
              ) : (
                <List>
                  {upcomingAppointments.slice(0, 3).map((appointment) => (
                    <ListItem key={appointment._id} divider>
                      <ListItemText
                        primary={`Dr. ${appointment.doctorName || appointment.doctor?.userId?.name || appointment.doctor?.name || 'Doctor'}`}
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              {new Date(appointment.scheduledTime).toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Specialization: {appointment.doctor?.specialization || 'General'}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Symptoms: {appointment.symptoms?.join(', ') || 'None specified'}
                            </Typography>
                            {queueUpdates[appointment._id] && (
                              <Typography variant="body2" color="warning.main">
                                Rescheduled: {queueUpdates[appointment._id].message}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end', minWidth: '100px' }}>
                        <Chip 
                          label={appointment.status} 
                          color={getStatusColor(appointment.status)}
                          size="small"
                        />
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => cancelPatientAppointment(appointment._id)}
                          sx={{ fontSize: '0.75rem' }}
                          disabled={appointment.status !== 'scheduled'}
                        >
                          Cancel
                        </Button>
                        {appointment.status === 'completed' && (
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => setReviewDialog({ open: true, doctor: appointment.doctor })}
                            sx={{ fontSize: '0.75rem', ml: 1 }}
                          >
                            ⭐ Review
                          </Button>
                        )}
                      </Box>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>



        {/* Recent Activity */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Activity</Typography>
              <List>
                {appointments.slice(0, 5).map((appointment) => (
                  <ListItem key={appointment._id} divider>
                    <ListItemText
                      primary={`Consultation with Dr. ${appointment.doctorName || appointment.doctor?.userId?.name || appointment.doctor?.name || 'Doctor'}`}
                      secondary={new Date(appointment.createdAt || appointment.scheduledTime).toLocaleDateString()}
                    />
                    <Chip 
                      label={appointment.status} 
                      color={getStatusColor(appointment.status)}
                      size="small"
                    />
                    {appointment.status === 'completed' && (
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => setReviewDialog({ open: true, doctor: appointment.doctor })}
                        sx={{ ml: 1, fontSize: '0.75rem' }}
                      >
                        ⭐ Rate Doctor
                      </Button>
                    )}
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      )}
      
      {/* Review Dialog */}
      <PatientReview
        open={reviewDialog.open}
        onClose={() => setReviewDialog({ open: false, doctor: null })}
        doctor={reviewDialog.doctor}
        patient={user}
        onReviewSubmit={(reviewData, newRating) => {
          console.log('Review submitted:', reviewData);
          loadDashboardData(); // Refresh data
        }}
      />
    </Container>
  );
}

export default Dashboard;