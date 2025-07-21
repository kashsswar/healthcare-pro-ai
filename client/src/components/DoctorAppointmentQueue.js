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
  }, [socket]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/appointments/doctor/${user.doctorId || user._id}`);
      const todayAppointments = response.data.filter(apt => {
        const aptDate = new Date(apt.scheduledTime).toDateString();
        const today = new Date().toDateString();
        return aptDate === today && apt.status === 'scheduled';
      });
      setAppointments(todayAppointments);
    } catch (error) {
      console.error('Failed to load appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const confirmAppointment = async (appointmentId) => {
    try {
      await axios.patch(`/api/appointments/${appointmentId}/confirm`);
      
      // Update local state
      setAppointments(prev => prev.map(apt => 
        apt._id === appointmentId 
          ? { ...apt, status: 'confirmed' }
          : apt
      ));
      
      // Notify patient via socket
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
                      📧 {appointment.patient?.email} | 📱 {appointment.patient?.phone}
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
                  <Box sx={{ ml: 7 }}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircle />}
                      onClick={() => confirmAppointment(appointment._id)}
                      sx={{ mr: 2 }}
                    >
                      ✅ Confirm Appointment
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Phone />}
                      href={`tel:${appointment.patient?.phone}`}
                    >
                      📞 Call Patient
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