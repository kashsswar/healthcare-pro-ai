import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  TextField, Typography, Box, Chip, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Schedule, Person } from '@mui/icons-material';

function QuickBookingForm({ open, onClose, doctor, patient, onBookingConfirm }) {
  const [symptoms, setSymptoms] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select date and time');
      return;
    }

    setSubmitting(true);
    try {
      console.log('Doctor object:', doctor);
      console.log('Patient object:', patient);
      console.log('=== BOOKING DATA ===');
      console.log('Full doctor object:', JSON.stringify(doctor, null, 2));
      console.log('doctor._id:', doctor._id);
      console.log('doctor.userId:', doctor.userId);
      console.log('doctor.userId._id:', doctor.userId?._id);
      console.log('doctor.doctorId:', doctor.doctorId);
      console.log('Expected doctor ID: 68833140c62b0feec7a55a6b');
      console.log('DoctorId being used in booking:', doctor.userId?._id || doctor._id);
      console.log('Patient ID:', patient._id || patient.id);
      
      const appointmentData = {
        patientId: patient._id || patient.id,
        doctorId: doctor.userId?._id || doctor._id,
        scheduledTime: new Date(`${selectedDate}T${selectedTime}`).toISOString(),
        symptoms: symptoms.split(',').map(s => s.trim()).filter(s => s),
        consultationFee: doctor.consultationFee,
        patient: {
          name: patient.name,
          email: patient.email,
          phone: patient.phone || '1234567890'
        },
        doctor: {
          name: doctor.userId.name,
          specialization: doctor.specialization
        },
        status: 'scheduled'
      };
      


      // Save to API database only
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      console.log('Booking appointment to:', `${apiUrl}/api/appointments`);
      console.log('Appointment data:', JSON.stringify(appointmentData, null, 2));
      
      const apiResponse = await fetch(`${apiUrl}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData)
      });
      
      if (!apiResponse.ok) {
        throw new Error('Failed to save appointment to database');
      }
      
      const savedAppointment = await apiResponse.json();
      console.log('Appointment saved to database:', savedAppointment);

      // Dispatch auto-refresh events
      window.dispatchEvent(new CustomEvent('appointmentUpdated', { 
        detail: { type: 'booked', appointment: savedAppointment } 
      }));
      
      if (onBookingConfirm) {
        onBookingConfirm(savedAppointment);
      }

      alert(`Appointment booked successfully with Dr. ${doctor.userId.name} on ${selectedDate} at ${selectedTime}`);
      
      // Reset form and close
      setSymptoms('');
      setSelectedDate('');
      setSelectedTime('');
      onClose();
    } catch (error) {
      alert('Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  // Get today's date as minimum
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Schedule color="primary" />
          Book Appointment with Dr. {doctor?.userId?.name}
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            <strong>Doctor:</strong> Dr. {doctor?.userId?.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            <strong>Specialization:</strong> {doctor?.specialization}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            <strong>Consultation Fee:</strong> ₹{doctor?.consultationFee}
          </Typography>
          
          <Box sx={{ my: 3 }}>
            <TextField
              fullWidth
              label="Select Date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: minDate, style: { cursor: 'pointer' } }}
              sx={{ 
                mb: 2, 
                '& .MuiInputBase-root': { cursor: 'pointer' },
                '& .MuiInputBase-input': { cursor: 'pointer' },
                '& input': { cursor: 'pointer !important' }
              }}
            />

            <FormControl fullWidth sx={{ 
              mb: 2, 
              '& .MuiInputBase-root': { cursor: 'pointer' },
              '& .MuiSelect-select': { cursor: 'pointer' },
              '& .MuiInputBase-input': { cursor: 'pointer' }
            }}>
              <InputLabel>Select Time</InputLabel>
              <Select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                label="Select Time"
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200,
                      overflow: 'auto'
                    }
                  }
                }}
              >
                {timeSlots.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
                <MenuItem disabled sx={{ justifyContent: 'center', bgcolor: 'primary.main', color: 'white' }}>
                  <Button 
                    size="small" 
                    variant="contained" 
                    onClick={() => document.activeElement.blur()}
                    sx={{ minWidth: '60px' }}
                  >
                    OK
                  </Button>
                </MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Describe your symptoms (optional)"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g., fever, headache, cough..."
              helperText="Separate multiple symptoms with commas"
              sx={{ 
                '& .MuiInputBase-root': { cursor: 'text' },
                '& .MuiInputBase-input': { cursor: 'text' },
                '& textarea': { cursor: 'text !important' }
              }}
            />
          </Box>

          <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="body2" color="textSecondary">
              <strong>Booking Summary:</strong><br/>
              Date: {selectedDate || 'Not selected'}<br/>
              Time: {selectedTime || 'Not selected'}<br/>
              Fee: ₹{doctor?.consultationFee}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={submitting || !selectedDate || !selectedTime}
        >
          {submitting ? 'Booking...' : `Book Now - ₹${doctor?.consultationFee}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default QuickBookingForm;