import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Card, CardContent, Typography, Button, 
  List, ListItem, ListItemText, Chip, Box, Tab, Tabs, Collapse 
} from '@mui/material';
import { ExpandMore, ExpandLess, Phone, CheckCircle } from '@mui/icons-material';
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
import BankDetails from '../components/BankDetails';
import PatientBankDetails from '../components/PatientBankDetails';
import DoctorPayouts from '../components/DoctorPayouts';
import PatientPaymentHistory from '../components/PatientPaymentHistory';


function Dashboard({ user, socket }) {
  const [appointments, setAppointments] = useState([]);
  const [healthRecommendations, setHealthRecommendations] = useState([]);
  const [queueUpdates, setQueueUpdates] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [reviewDialog, setReviewDialog] = useState({ open: false, doctor: null });
  const [bankDialog, setBankDialog] = useState(false);
  const [patientBankDialog, setPatientBankDialog] = useState(false);
  const [recentListExpanded, setRecentListExpanded] = useState(false);
  const [todayQueueExpanded, setTodayQueueExpanded] = useState(false);
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
             (apt.status === 'scheduled' || apt.status === 'in-progress');
    }).length;
  };
  
  const [todayAppointments, setTodayAppointments] = useState([]);
  
  const loadTodayAppointments = async () => {
    try {
      const userId = user._id || user.id;
      console.log('Loading appointments for doctor ID:', userId);
      if (!userId) {
        console.log('No user ID found');
        return;
      }
      
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const url = `${apiUrl}/api/appointments/doctor/${userId}`;
      console.log('Fetching appointments from:', url);
      
      const response = await fetch(url);
      console.log('API response status:', response.status);
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        console.log('Response content type:', contentType);
        
        if (contentType && contentType.includes('application/json')) {
          const allAppointments = await response.json();
          console.log('=== DASHBOARD API RESPONSE ===');
          console.log('All appointments from API:', allAppointments);
          console.log('Total appointments count:', allAppointments.length);
          
          if (allAppointments.length > 0) {
            console.log('Setting appointments to state...');
            setTodayAppointments(allAppointments);
            console.log('State should be updated now');
            
            // Log each appointment's date
            allAppointments.forEach((apt, index) => {
              console.log(`Dashboard Appointment ${index}:`, {
                id: apt._id,
                scheduledTime: apt.scheduledTime,
                date: new Date(apt.scheduledTime).toLocaleString(),
                dateString: new Date(apt.scheduledTime).toDateString(),
                status: apt.status,
                patient: apt.patient?.name
              });
            });
          } else {
            console.log('No appointments returned from API');
            setTodayAppointments([]);
          }
        } else {
          console.log('API returned non-JSON response');
          setTodayAppointments([]);
        }
      } else {
        console.log('API response not ok, status:', response.status);
        const errorText = await response.text();
        console.log('Error response:', errorText);
        setTodayAppointments([]);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      setTodayAppointments([]);
    }
  };
  
  const getTodayQueue = () => {
    console.log('=== getTodayQueue called ===');
    console.log('todayAppointments array:', todayAppointments);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    console.log('Today date range:', today.toLocaleString(), 'to', tomorrow.toLocaleString());
    
    const filteredAppointments = todayAppointments.filter(apt => {
      const aptDate = new Date(apt.scheduledTime);
      const isToday = aptDate >= today && aptDate < tomorrow;
      const isActive = apt.status === 'scheduled' || apt.status === 'in-progress';
      
      return isToday && isActive;
    });
    
    console.log('Today queue result:', {
      totalAppointments: todayAppointments.length,
      filteredCount: filteredAppointments.length,
      todayDate: today.toDateString()
    });
    
    return filteredAppointments;
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
  
  const [adminBoost, setAdminBoost] = useState(0);
  
  const loadAdminBoost = async () => {
    try {
      const userId = user._id || user.id;
      if (!userId) return;
      
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/api/admin-boost/doctor/${userId}`);
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setAdminBoost(data.adminBoostRating || 0);
        } else {
          console.log('Non-JSON response, setting boost to 0');
          setAdminBoost(0);
        }
      } else {
        console.log('API response not ok, setting boost to 0');
        setAdminBoost(0);
      }
    } catch (error) {
      console.error('Error loading admin boost:', error);
      setAdminBoost(0);
    }
  };
  
  const getAdminBoost = () => {
    return adminBoost;
  };
  
  const [consultationFee, setConsultationFee] = useState(null);
  
  const loadDoctorProfile = async () => {
    try {
      const userId = user._id || user.id;
      if (!userId) return;
      
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/api/doctor-profile/${userId}`);
      if (response.ok) {
        const doctorData = await response.json();
        setConsultationFee(doctorData.consultationFee || null);
      }
    } catch (error) {
      console.error('Error loading doctor profile:', error);
    }
  };
  
  const getCurrentConsultationFee = () => {
    return consultationFee;
  };

  const loadDashboardData = React.useCallback(async () => {
    try {
      const userId = user._id || user.id;
      if (!userId) return;
      
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      // Load different endpoints based on user role
      const endpoint = user.role === 'doctor' 
        ? `${apiUrl}/api/appointments/doctor/${userId}`
        : `${apiUrl}/api/appointments/patient/${userId}`;
      
      // Add timestamp to prevent caching
      const urlWithTimestamp = `${endpoint}?t=${Date.now()}`;
      console.log('Loading appointments from:', urlWithTimestamp);
      const response = await fetch(urlWithTimestamp);
      
      if (response.ok) {
        const appointments = await response.json();
        console.log('=== DASHBOARD API RESPONSE ===');
        console.log('Raw appointments from API:', appointments);
        console.log('Number of appointments:', appointments.length);
        
        const processedAppointments = appointments.map(apt => ({
          ...apt,
          status: apt.status || 'scheduled',
          doctorName: apt.doctor?.name || apt.doctorName || 'Doctor'
        }));
        
        console.log('Processed appointments:', processedAppointments);
        setAppointments(processedAppointments);
      } else {
        console.log('Failed to load appointments, status:', response.status);
        const errorText = await response.text();
        console.log('Error response:', errorText);
        setAppointments([]);
      }
      
    } catch (error) {
      console.error('Dashboard load error:', error);
      setAppointments([]);
    }
  }, [user.id, user._id, user.role]);

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  useEffect(() => {
    loadDashboardData();
    if (user.role === 'doctor') {
      loadDoctorProfile();
      loadAdminBoost();
      loadTodayAppointments();
    }
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
    
    // Refresh appointments when new ones are booked
    const handleAppointmentRefresh = () => {
      if (user.role === 'doctor') {
        loadTodayAppointments();
      }
    };
    window.addEventListener('appointmentUpdated', handleAppointmentRefresh);
    
    // Periodic auto-refresh every 5 minutes
    const autoRefreshInterval = setInterval(handleRefresh, 300000);
    
    return () => {
      window.removeEventListener('doctorProfileUpdated', handleRefresh);
      window.removeEventListener('patientProfileUpdated', handleRefresh);
      window.removeEventListener('adminRatingUpdated', handleRefresh);
      window.removeEventListener('appointmentUpdated', handleRefresh);
      window.removeEventListener('storage', handleRefresh);
      window.removeEventListener('appointmentUpdated', handleAppointmentRefresh);
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
  
  const confirmAppointment = async (appointmentId) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' })
      });
      
      if (response.ok) {
        alert('Appointment marked as completed!');
        loadTodayAppointments();
      }
    } catch (error) {
      console.error('Failed to complete appointment:', error);
      alert('Failed to complete appointment');
    }
  };
  
  const cancelDoctorAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment? Money will be refunded to patient.')) {
      return;
    }
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/appointments/${appointmentId}/cancel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cancelledBy: 'doctor' })
      });
      
      if (response.ok) {
        alert('Appointment cancelled successfully! Money has been refunded to patient account.');
        loadTodayAppointments();
      }
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      alert('Failed to cancel appointment');
    }
  };

  const cancelPatientAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment? You will receive a full refund.')) {
      return;
    }
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/appointments/${appointmentId}/cancel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cancelledBy: 'patient' })
      });
      
      if (response.ok) {
        setAppointments(prev => prev.map(apt => 
          apt._id === appointmentId 
            ? { ...apt, status: 'cancelled' }
            : apt
        ));
        
        window.dispatchEvent(new CustomEvent('appointmentUpdated', { 
          detail: { type: 'cancelled', appointmentId } 
        }));
        
        if (socket) {
          socket.emit('appointment-cancelled', {
            appointmentId,
            patientName: user.name,
            message: `${user.name} has cancelled their appointment`
          });
        }
        
        alert('Appointment cancelled successfully! Booking amount has been refunded to your account.');
        loadDashboardData();
      } else {
        throw new Error('Failed to cancel appointment');
      }
      
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      alert('Failed to cancel appointment. Please try again.');
    }
  };

  const upcomingAppointments = appointments.filter(apt => {
    const appointmentTime = new Date(apt.scheduledTime);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointmentTime >= today && apt.status !== 'cancelled';
  });
  
  console.log('=== PATIENT APPOINTMENTS DEBUG ===');
  console.log('Total appointments loaded:', appointments.length);
  console.log('All appointments:', appointments);
  console.log('Upcoming appointments:', upcomingAppointments.length);
  console.log('User role:', user.role);
  console.log('User ID:', user._id || user.id);
  console.log('==================================');

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
        {/* <DoctorAppointmentQueue user={{...user, doctorId: user._id || user.id}} socket={socket} /> */}
        

        
        {/* Doctor Payouts */}
        <DoctorPayouts user={user} />
        
        {/* Today's Patient Queue - Collapsible */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Button 
                onClick={() => setTodayQueueExpanded(!todayQueueExpanded)}
                startIcon={todayQueueExpanded ? <ExpandLess /> : <ExpandMore />}
                sx={{ textTransform: 'none', p: 0 }}
              >
                <Typography variant="h6">
                  📋 Today's Patient Queue ({getTodayQueue().length})
                </Typography>
              </Button>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={async () => {
                  await loadTodayAppointments();
                }}
              >
                🔄 Refresh
              </Button>
            </Box>
            
            <Collapse in={todayQueueExpanded}>
              <Box sx={{ mt: 2 }}>
                {getTodayQueue().length === 0 ? (
                  <Typography color="textSecondary">No appointments scheduled for today</Typography>
                ) : (
                  getTodayQueue().map((appointment) => (
                    <Card key={appointment._id} sx={{ mb: 2, bgcolor: 'grey.50' }}>
                      <CardContent>
                        <Typography variant="h6">{appointment.patientId?.name || appointment.patient?.name || 'Patient'}</Typography>
                        <Typography variant="body2">📧 {appointment.patientId?.email || appointment.patient?.email || 'No email'} | 📱 {appointment.patientId?.phone || appointment.patient?.phone || 'No phone'}</Typography>
                        <Chip 
                          label={appointment.status?.toUpperCase() || 'SCHEDULED'} 
                          color={appointment.status === 'in-progress' ? 'warning' : 'primary'}
                          sx={{ mt: 1 }}
                        />
                        <Typography variant="body2" sx={{ mt: 1 }}>Scheduled: {new Date(appointment.scheduledTime).toLocaleString()}</Typography>
                        {appointment.symptoms && appointment.symptoms.length > 0 && (
                          <Typography variant="body2">🩺 Symptoms: {appointment.symptoms.join(', ')}</Typography>
                        )}
                        
                        {appointment.status === 'scheduled' && (
                          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                            <Button
                              variant="contained"
                              color="success"
                              startIcon={<CheckCircle />}
                              onClick={() => confirmAppointment(appointment._id)}
                              size="small"
                            >
                              ✅ DONE
                            </Button>
                            <Button
                              variant="outlined"
                              startIcon={<Phone />}
                              onClick={() => {
                                const phoneNumber = appointment.patientId?.phone || appointment.patient?.phone;
                                if (phoneNumber) {
                                  window.open(`tel:${phoneNumber}`, '_self');
                                } else {
                                  alert('Patient phone number not available');
                                }
                              }}
                              size="small"
                            >
                              📞 Call
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => cancelDoctorAppointment(appointment._id)}
                              size="small"
                            >
                              ❌ Cancel
                            </Button>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </Box>
            </Collapse>
          </CardContent>
        </Card>
        
        {/* Recent Patient List - Collapsible */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Button 
              onClick={() => setRecentListExpanded(!recentListExpanded)}
              startIcon={recentListExpanded ? <ExpandLess /> : <ExpandMore />}
              sx={{ textTransform: 'none', p: 0 }}
            >
              <Typography variant="h6">
                📋 Recent Patient List ({todayAppointments.length})
              </Typography>
            </Button>
            
            <Collapse in={recentListExpanded}>
              <Box sx={{ mt: 2 }}>
                {todayAppointments.length === 0 ? (
                  <Typography color="textSecondary">No recent appointments</Typography>
                ) : (
                  todayAppointments.map((appointment) => (
                    <Card key={appointment._id} sx={{ mb: 2, bgcolor: 'rgb(235, 235, 232)' }}>
                      <CardContent>
                        <Typography variant="h6">{appointment.patientId?.name || appointment.patient?.name || 'Patient'}</Typography>
                        <Typography variant="body2">📧 {appointment.patientId?.email || appointment.patient?.email || 'No email'} | 📱 {appointment.patientId?.phone || appointment.patient?.phone || 'No phone'}</Typography>
                        <Chip 
                          label={appointment.status?.toUpperCase() || 'SCHEDULED'} 
                          color={getStatusColor(appointment.status)}
                          sx={{ mt: 1 }}
                        />
                        <Typography variant="body2" sx={{ mt: 1 }}>Scheduled: {new Date(appointment.scheduledTime).toLocaleString()}</Typography>
                        {appointment.symptoms && appointment.symptoms.length > 0 && (
                          <Typography variant="body2">🩺 Symptoms: {appointment.symptoms.join(', ')}</Typography>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </Box>
            </Collapse>
          </CardContent>
        </Card>
        
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
                    <Typography variant="h5" color="info.main">
                      {getCurrentConsultationFee() ? `₹${getCurrentConsultationFee()}` : 'Not Set'}
                    </Typography>
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
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  💳 Bank Account
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => setBankDialog(true)}
                  fullWidth
                >
                  Setup Bank Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
        </Grid>
        
        {/* Doctor Bank Details Dialog */}
        <BankDetails
          open={bankDialog}
          onClose={() => setBankDialog(false)}
          doctor={user}
        />
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
        {/* Patient Profile - Only show for patients */}
        {user.role === 'patient' && (
          <Grid item xs={12}>
            <PatientProfile user={user} />
          </Grid>
        )}
        
        {/* Patient Payment History - Only show for patients */}
        {user.role === 'patient' && (
          <Grid item xs={12}>
            <PatientPaymentHistory user={user} />
          </Grid>
        )}
        
        {/* Local Doctors List - Only show for patients */}
        {user.role === 'patient' && (
          <Grid item xs={12}>
            <LocalDoctorsList user={user} onBookAppointment={handleBookAppointment} />
          </Grid>
        )}
        
        {/* Doctor Availability Checker - Only show for patients */}
        {user.role === 'patient' && (
          <Grid item xs={12}>
            <DoctorAvailabilityChecker />
          </Grid>
        )}
        
        {/* AI Auto-Marketing - Only show for patients */}
        {user.role === 'patient' && (
          <Grid item xs={12}>
            <AutoMarketing />
          </Grid>
        )}
        

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
                <Button 
                  variant="outlined" 
                  onClick={() => setPatientBankDialog(true)}
                  fullWidth
                >
                  💳 Payment Method
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Appointments */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  {t('upcomingAppointments')} ({upcomingAppointments.length})
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => {
                    console.log('Manual refresh triggered');
                    loadDashboardData();
                  }}
                >
                  🔄 Refresh
                </Button>
              </Box>
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
                          disabled={appointment.status === 'completed' || appointment.status === 'cancelled'}
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
                      secondary={new Date(appointment.scheduledTime).toLocaleDateString()}
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
      
      {/* Patient Bank Details Dialog */}
      <PatientBankDetails
        open={patientBankDialog}
        onClose={() => setPatientBankDialog(false)}
        onSave={(bankInfo) => {
          localStorage.setItem(`patient_${user.id}_bank`, JSON.stringify(bankInfo));
          alert('Payment method saved successfully!');
        }}
      />
    </Container>
  );
}

export default Dashboard;