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


function Dashboard({ user, socket }) {
  const [appointments, setAppointments] = useState([]);
  const [healthRecommendations, setHealthRecommendations] = useState([]);
  const [queueUpdates, setQueueUpdates] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleBookAppointment = (doctor) => {
    navigate(`/book-appointment/${doctor._id}`);
  };

  const loadDashboardData = React.useCallback(async () => {
    try {
      // Load appointments from localStorage
      const bookedAppointments = JSON.parse(localStorage.getItem('bookedAppointments') || '[]');
      const userAppointments = bookedAppointments.filter(apt => 
        apt.patient?.email === user.email || apt.patientId === user.id
      );
      setAppointments(userAppointments);
      
    } catch (error) {
      console.error('Dashboard load error:', error);
      setAppointments([]);
    }
  }, [user.id, user.email]);

  useEffect(() => {
    loadDashboardData();
    
    // Socket disabled to prevent connection errors
    // if (socket) {
    //   socket.on('appointment-rescheduled', (data) => {
    //     setQueueUpdates(prev => ({ ...prev, [data.appointmentId]: data }));
    //   });
    //   
    //   socket.on('consultation-started', () => {
    //     loadDashboardData();
    //   });
    // }
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
    if (!confirm('Are you sure you want to cancel this appointment? You will receive a full refund.')) {
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
      
      // Simulate refund notification
      alert('Appointment cancelled successfully! ₹500 has been refunded to your account. It will reflect in 2-3 business days.');
      
      // Reload dashboard data
      loadDashboardData();
      
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      alert('Failed to cancel appointment. Please try again.');
    }
  };

  const upcomingAppointments = appointments.filter(apt => 
    apt.status === 'scheduled' && new Date(apt.scheduledTime) > new Date()
  );

  if (user.role === 'doctor') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          👨‍⚕️ Dr. {user.name} - {t('home')}
        </Typography>
        
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
                <Typography variant="h4" color="primary">3</Typography>
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
                <Typography variant="h4" color="success.main">₹1,500</Typography>
                <Typography variant="body2">From 3 consultations</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ⭐ Your Rating
                </Typography>
                <Typography variant="h4" color="warning.main">{user.finalRating || user.rating || '4.8'}</Typography>
                <Typography variant="body2">
                  {user.adminBoostRating > 0 ? 'Admin Boosted Rating' : 'Based on patient reviews'}
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
        <PatientDoctorSearch onBookAppointment={handleBookAppointment} />
      ) : (
      <Grid container spacing={3}>
        {/* Patient Profile */}
        <Grid item xs={12}>
          <PatientProfile user={user} />
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
                        primary={`Dr. ${appointment.doctor?.userId?.name}`}
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              {new Date(appointment.scheduledTime).toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Specialization: {appointment.doctor?.specialization}
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
                        {appointment.status === 'scheduled' && (
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => cancelPatientAppointment(appointment._id)}
                            sx={{ fontSize: '0.75rem' }}
                          >
                            Cancel
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
                      primary={`Consultation with Dr. ${appointment.doctor?.userId?.name}`}
                      secondary={new Date(appointment.createdAt).toLocaleDateString()}
                    />
                    <Chip 
                      label={appointment.status} 
                      color={getStatusColor(appointment.status)}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      )}
    </Container>
  );
}

export default Dashboard;