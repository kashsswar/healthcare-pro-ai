import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Select, MenuItem, FormControl, Menu, List, ListItem, ListItemText, Chip, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LocalHospital, ExpandMore } from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const [queueAnchor, setQueueAnchor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  
  const loadAppointments = async () => {
    if (user.role !== 'doctor') return;
    
    try {
      const doctorId = user._id || user.id;
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/appointments/doctor/${doctorId}`);
      
      if (response.ok) {
        const allAppointments = await response.json();
        const todayAndFuture = allAppointments.filter(apt => {
          const aptDate = new Date(apt.scheduledTime);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return aptDate >= today;
        });
        setAppointments(todayAndFuture);
      }
    } catch (error) {
      console.error('Failed to load appointments:', error);
    }
  };
  
  useEffect(() => {
    loadAppointments();
    
    const handleAppointmentUpdate = () => {
      loadAppointments();
    };
    
    window.addEventListener('appointmentUpdated', handleAppointmentUpdate);
    
    return () => {
      window.removeEventListener('appointmentUpdated', handleAppointmentUpdate);
    };
  }, [user]);
  
  const languages = [
    { code: 'en', name: '🇬🇧 English' },
    { code: 'hi', name: '🇮🇳 हिंदी' },
    { code: 'ta', name: '🇮🇳 தமிழ்' },
    { code: 'te', name: '🇮🇳 తెలుగు' },
    { code: 'bn', name: '🇮🇳 বাংলা' }
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <LocalHospital sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {t('appName')}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ mr: 2 }}>
            <Select
              value={currentLanguage}
              onChange={(e) => changeLanguage(e.target.value)}
              sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}
            >
              {languages.map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>{lang.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button color="inherit" onClick={() => {
            navigate('/dashboard');
            window.location.href = '/dashboard';
          }}>
            {t('home')}
          </Button>
          {user.role === 'patient' && (
            <>
              <Button color="inherit" onClick={() => navigate('/doctors')}>
                {t('findDoctor')}
              </Button>
              <Button color="inherit" onClick={() => navigate('/health-recommendations')}>
                {t('healthTips')}
              </Button>
            </>
          )}
          {user.role === 'doctor' && (
            <>
              <Button 
                color="inherit" 
                onClick={(e) => setQueueAnchor(e.currentTarget)}
                endIcon={<ExpandMore />}
              >
                My Queue ({appointments.length})
              </Button>
              <Menu
                anchorEl={queueAnchor}
                open={Boolean(queueAnchor)}
                onClose={() => setQueueAnchor(null)}
                PaperProps={{
                  style: {
                    maxHeight: 400,
                    width: 350,
                  },
                }}
              >
                {appointments.length === 0 ? (
                  <MenuItem disabled>
                    No appointments scheduled
                  </MenuItem>
                ) : (
                  appointments.map((appointment, index) => (
                    <div key={appointment._id}>
                      <MenuItem onClick={() => {
                        setQueueAnchor(null);
                        navigate('/dashboard');
                      }}>
                        <ListItemText
                          primary={appointment.patient?.name || 'Patient'}
                          secondary={
                            <>
                              <div>{new Date(appointment.scheduledTime).toLocaleString()}</div>
                              <Chip 
                                label={appointment.status.toUpperCase()} 
                                size="small" 
                                color={appointment.status === 'scheduled' ? 'warning' : 'success'}
                                sx={{ mt: 0.5 }}
                              />
                            </>
                          }
                        />
                      </MenuItem>
                      {index < appointments.length - 1 && <Divider />}
                    </div>
                  ))
                )}
              </Menu>
            </>
          )}
          <Button color="inherit" onClick={onLogout}>
            {t('logout')} ({user.name})
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;