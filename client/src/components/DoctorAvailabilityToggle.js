import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Switch, FormControlLabel, 
  Box, Chip, Button, Alert, TextField, Grid
} from '@mui/material';
import { Circle, Schedule, AccessTime } from '@mui/icons-material';
import axios from 'axios';

function DoctorAvailabilityToggle({ user, socket }) {
  const [isAvailable, setIsAvailable] = useState(true);
  const [currentStatus, setCurrentStatus] = useState('Available');
  const [waitingPatients, setWaitingPatients] = useState(0);
  const [timeSlots, setTimeSlots] = useState({
    startTime: '09:00',
    endTime: '17:00'
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    loadAvailabilityStatus();
    
    // Auto-refresh when appointments change
    const handleRefresh = () => {
      console.log('Refreshing doctor availability...');
      setRefreshTrigger(prev => prev + 1);
      loadAvailabilityStatus();
    };
    
    window.addEventListener('appointmentUpdated', handleRefresh);
    window.addEventListener('storage', handleRefresh);
    
    if (socket) {
      socket.on('new-appointment', handleRefresh);
      socket.on('appointment-completed', handleRefresh);
    }
    
    return () => {
      window.removeEventListener('appointmentUpdated', handleRefresh);
      window.removeEventListener('storage', handleRefresh);
    };
  }, [socket]);

  const loadAvailabilityStatus = async () => {
    try {
      // Load availability status
      const savedStatus = localStorage.getItem(`doctor_${user.doctorId}_availability`);
      if (savedStatus) {
        const status = JSON.parse(savedStatus);
        setIsAvailable(status.isAvailable);
        setCurrentStatus(status.isAvailable ? 'Available' : 'Unavailable');
      }
      
      // Load time slots
      const savedTimeSlots = localStorage.getItem(`doctor_${user.doctorId}_timeslots`);
      if (savedTimeSlots) {
        setTimeSlots(JSON.parse(savedTimeSlots));
      }
      
      // Load real appointments count from localStorage
      const bookedAppointments = JSON.parse(localStorage.getItem('bookedAppointments') || '[]');
      const today = new Date().toDateString();
      const waitingCount = bookedAppointments.filter(apt => {
        const aptDate = new Date(apt.scheduledTime).toDateString();
        return (apt.doctorId === user.doctorId || apt.doctor === user.doctorId) && 
               aptDate === today && 
               (apt.status === 'scheduled' || apt.status === 'in-progress');
      }).length;
      setWaitingPatients(waitingCount);
    } catch (error) {
      console.error('Failed to load availability status:', error);
    }
  };

  const toggleAvailability = async () => {
    try {
      const newStatus = !isAvailable;
      
      // Save availability status
      localStorage.setItem(`doctor_${user.doctorId}_availability`, JSON.stringify({
        isAvailable: newStatus,
        timestamp: new Date()
      }));
      
      setIsAvailable(newStatus);
      setCurrentStatus(newStatus ? 'Available' : 'Unavailable');
      
      // Notify via socket if available
      if (socket) {
        socket.emit('doctor-availability-changed', {
          doctorId: user.doctorId,
          isAvailable: newStatus,
          timeSlots,
          timestamp: new Date()
        });
      }
      
      alert(`Status updated to ${newStatus ? 'Available' : 'Unavailable'}`);
      
    } catch (error) {
      console.error('Failed to toggle availability:', error);
      alert('Failed to update availability status');
    }
  };
  
  const updateTimeSlots = (field, value) => {
    const newTimeSlots = { ...timeSlots, [field]: value };
    setTimeSlots(newTimeSlots);
    
    // Save time slots
    localStorage.setItem(`doctor_${user.doctorId}_timeslots`, JSON.stringify(newTimeSlots));
    
    // Notify via socket
    if (socket) {
      socket.emit('doctor-timeslots-updated', {
        doctorId: user.doctorId,
        timeSlots: newTimeSlots,
        timestamp: new Date()
      });
    }
  };

  const getStatusColor = () => {
    return isAvailable ? 'success' : 'error';
  };

  const getStatusIcon = () => {
    return isAvailable ? '🟢' : '🔴';
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            🩺 Availability Status
          </Typography>
          <Chip 
            icon={<Circle />}
            label={currentStatus}
            color={getStatusColor()}
            variant="filled"
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isAvailable}
                onChange={toggleAvailability}
                color="success"
                size="large"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1">
                  {getStatusIcon()} {isAvailable ? 'Available for Appointments' : 'Currently Unavailable'}
                </Typography>
              </Box>
            }
          />
        </Box>

        {isAvailable && (
          <Alert severity="success" sx={{ mb: 2 }}>
            ✅ You are currently accepting new appointments. Patients can book consultations with you.
          </Alert>
        )}

        {!isAvailable && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            ⚠️ You are currently unavailable. New appointment bookings are paused.
          </Alert>
        )}

        {/* Time Slots Configuration */}
        <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AccessTime color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">⏰ Available Hours</Typography>
          </Box>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                label="Start Time"
                type="time"
                value={timeSlots.startTime}
                onChange={(e) => updateTimeSlots('startTime', e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="End Time"
                type="time"
                value={timeSlots.endTime}
                onChange={(e) => updateTimeSlots('endTime', e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                📅 Available: {timeSlots.startTime} - {timeSlots.endTime}
              </Typography>
            </Grid>
          </Grid>
        </Card>

        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Schedule color="primary" />
            <Typography variant="body2">
              Waiting Patients: <strong>{waitingPatients}</strong>
            </Typography>
          </Box>
          
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => window.location.reload()}
          >
            Refresh Status
          </Button>
        </Box>

        <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
          <Typography variant="body2" color="info.contrastText">
            💡 <strong>Live Updates:</strong> Your availability status is updated in real-time. 
            Patients will see your current status when booking appointments.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default DoctorAvailabilityToggle;