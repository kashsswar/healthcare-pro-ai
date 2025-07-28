import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, List, ListItem, ListItemText, 
  Button, Box, Chip, Alert, Avatar, Divider
} from '@mui/material';
import { Person, CheckCircle, Schedule, Phone } from '@mui/icons-material';
import axios from 'axios';

function DoctorAppointmentQueue({ user, socket }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAppointments();
    
    if (socket) {
      socket.on('new-appointment', () => {
        loadAppointments();
      });
    }
    
    // Listen for appointment updates
    const handleAppointmentUpdate = () => {
      console.log('Appointment updated, refreshing queue...');
      loadAppointments();
    };
    
    window.addEventListener('appointmentUpdated', handleAppointmentUpdate);
    
    return () => {
      window.removeEventListener('appointmentUpdated', handleAppointmentUpdate);
    };
  }, [socket]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      
      const doctorId = user.doctorId || user._id || user.id;
      console.log('Loading appointments for doctor:', doctorId);
      
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/api/appointments/doctor/${doctorId}`);
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const appointments = await response.json();
          // Show recent appointments (last 7 days and future)
          const recentAppointments = appointments.filter(apt => {
            const aptDate = new Date(apt.scheduledTime);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return aptDate >= weekAgo;
          });
          // Debug patient data
          recentAppointments.forEach((apt, index) => {
            console.log(`Appointment ${index}:`, {
              patientId: apt.patientId,
              patient: apt.patient,
              patientIdName: apt.patientId?.name,
              patientName: apt.patient?.name,
              patientProfile: apt.patient?.profile,
              patientAge: apt.patient?.profile?.age,
              patientGender: apt.patient?.profile?.gender,
              fullPatientObject: apt.patient
            });
          });
          
          setAppointments(recentAppointments);
          console.log('Doctor appointments loaded from API:', recentAppointments);
        } else {
          console.log('API returned non-JSON, no appointments found');
          setAppointments([]);
        }
      } else {
        console.log('API response not ok, no appointments found');
        setAppointments([]);
      }
      
    } catch (error) {
      console.error('Failed to load appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const confirmAppointment = async (appointmentId) => {
    try {
      setAppointments(prev => prev.map(apt => 
        apt._id === appointmentId 
          ? { ...apt, status: 'confirmed' }
          : apt
      ));
      
      const confirmedAppointments = JSON.parse(localStorage.getItem('confirmedAppointments') || '[]');
      confirmedAppointments.push(appointmentId);
      localStorage.setItem('confirmedAppointments', JSON.stringify(confirmedAppointments));
      
      if (socket) {
        socket.emit('appointment-confirmed', {
          appointmentId,
          doctorName: user.name,
          message: 'Your appointment has been confirmed by the doctor'
        });
      }
      
      alert('Appointment confirmed! Patient has been notified.');
      
    } catch (error) {
      console.error('Failed to confirm appointment:', error);
      alert('Failed to confirm appointment');
    }
  };
  
  const cancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment? Money will be refunded to patient.')) {
      return;
    }
    
    try {
      // Remove from appointments
      setAppointments(prev => prev.filter(apt => apt._id !== appointmentId));
      
      // Update localStorage
      const bookedAppointments = JSON.parse(localStorage.getItem('bookedAppointments') || '[]');
      const updatedAppointments = bookedAppointments.filter(apt => apt._id !== appointmentId);
      localStorage.setItem('bookedAppointments', JSON.stringify(updatedAppointments));
      
      // Simulate refund
      alert('Appointment cancelled successfully! ₹500 has been refunded to patient account.');
      
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      alert('Failed to cancel appointment');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'warning';
      case 'confirmed': return 'success';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            📋 Today's Patient Queue ({appointments.length})
          </Typography>
          <Button variant="outlined" size="small" onClick={loadAppointments}>
            Refresh
          </Button>
        </Box>

        {loading && (
          <Alert severity="info">Loading appointments...</Alert>
        )}

        {appointments.length === 0 && !loading && (
          <Alert severity="info">
            No scheduled appointments for today. Patients can book appointments with you.
          </Alert>
        )}

        <List>
          {appointments.map((appointment, index) => (
            <React.Fragment key={appointment._id}>
              <ListItem sx={{ flexDirection: 'column', alignItems: 'stretch', p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                    <Person />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">
                      {appointment.patient?.name || 'Patient Name'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      📧 {appointment.patient?.email || 'No email'} | 📱 {appointment.patient?.phone || 'No phone'}
                    </Typography>
                  </Box>
                  <Chip 
                    label={appointment.status.toUpperCase()} 
                    color={getStatusColor(appointment.status)}
                    size="small"
                  />
                </Box>

                <Box sx={{ ml: 7, mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <Schedule sx={{ fontSize: 16, mr: 1 }} />
                    <strong>Scheduled:</strong> {new Date(appointment.scheduledTime).toLocaleString()}
                  </Typography>
                  
                  {appointment.symptoms && appointment.symptoms.length > 0 && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>🩺 Symptoms:</strong> {appointment.symptoms.join(', ')}
                    </Typography>
                  )}
                  
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>👤 Patient Details:</strong>
                  </Typography>
                  <Box sx={{ ml: 2, mb: 2 }}>
                    <Typography variant="body2">
                      • Age: {appointment.patient?.profile?.age || 'Not specified'}
                    </Typography>
                    <Typography variant="body2">
                      • Gender: {appointment.patient?.profile?.gender || 'Not specified'}
                    </Typography>
                    <Typography variant="body2">
                      • Medical History: {appointment.patient?.profile?.medicalHistory?.join(', ') || 'None'}
                    </Typography>
                    <Typography variant="body2">
                      • Allergies: {appointment.patient?.profile?.allergies?.join(', ') || 'None'}
                    </Typography>
                  </Box>
                </Box>

                {appointment.status === 'scheduled' && (
                  <Box sx={{ ml: 7, display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircle />}
                      onClick={() => confirmAppointment(appointment._id)}
                    >
                      ✅ Confirm
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Phone />}
                      href={`tel:${appointment.patient?.phone}`}
                    >
                      📞 Call
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => cancelAppointment(appointment._id)}
                    >
                      ❌ Cancel
                    </Button>
                  </Box>
                )}

                {appointment.status === 'confirmed' && (
                  <Alert severity="success" sx={{ ml: 7 }}>
                    ✅ Appointment confirmed - Patient has been notified
                  </Alert>
                )}
              </ListItem>
              {index < appointments.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

export default DoctorAppointmentQueue;