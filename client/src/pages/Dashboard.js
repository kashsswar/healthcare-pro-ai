import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Card, CardContent, Typography, Button, 
  List, ListItem, ListItemText, Chip, Box, Tab, Tabs 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI, aiAPI } from '../services/api';
import { useLanguage } from '../App';
import PatientDoctorSearch from '../components/PatientDoctorSearch';
import AutoMarketing from '../components/AutoMarketing';
import ViralGrowthEngine from '../components/ViralGrowthEngine';

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
      // Load appointments
      const appointmentsRes = await appointmentAPI.getPatientAppointments(user.id);
      setAppointments(appointmentsRes.data);
      
      // Load AI health recommendations
      const recommendationsRes = await aiAPI.getHealthRecommendations(user.id);
      setHealthRecommendations(recommendationsRes.data.recommendations);
    } catch (error) {
      console.error('Dashboard load error:', error);
    }
  }, [user.id]);

  useEffect(() => {
    loadDashboardData();
    
    if (socket) {
      socket.on('appointment-rescheduled', (data) => {
        setQueueUpdates(prev => ({ ...prev, [data.appointmentId]: data }));
      });
      
      socket.on('consultation-started', () => {
        loadDashboardData();
      });
    }
  }, [socket, loadDashboardData]);

  const getStatusColor = (status) => {
    const colors = {
      'scheduled': 'primary',
      'in-progress': 'warning',
      'completed': 'success',
      'cancelled': 'error'
    };
    return colors[status] || 'default';
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
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('todaysAppointments')}
                </Typography>
                <Typography variant="h3" color="primary">5</Typography>
                <Button variant="contained" onClick={() => navigate('/queue/1')} sx={{ mt: 2 }}>
                  {t('manageQueue')}
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('patientAnalytics')}
                </Typography>
                <Typography variant="body2">{t('totalPatients')}: 250 👥</Typography>
                <Typography variant="body2">{t('avgRating')}: 4.5/5 ⭐</Typography>
                <Typography variant="body2">{t('thisMonth')}: 45 📅</Typography>
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
        {/* AI Auto-Marketing */}
        <Grid item xs={12}>
          <AutoMarketing />
        </Grid>
        
        {/* Viral Growth Engine */}
        <Grid item xs={12}>
          <ViralGrowthEngine user={user} />
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
                      <Chip 
                        label={appointment.status} 
                        color={getStatusColor(appointment.status)}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* AI Health Recommendations */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  AI Health Recommendations
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={loadDashboardData}
                >
                  Refresh
                </Button>
              </Box>
              {healthRecommendations.length === 0 ? (
                <Box>
                  <Typography color="textSecondary" sx={{ mb: 2 }}>
                    No recommendations available. Here are some general health tips:
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText primary="Drink plenty of water throughout the day" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Exercise for at least 30 minutes, 5 days a week" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Get 7-8 hours of quality sleep each night" />
                    </ListItem>
                  </List>
                </Box>
              ) : (
                <List>
                  {healthRecommendations.slice(0, 5).map((recommendation, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={recommendation} />
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