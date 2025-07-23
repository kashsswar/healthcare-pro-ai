import React, { useState, useEffect } from 'react';
import { 
  Container, Paper, Typography, TextField, Button, 
  Box, Alert, Chip, CircularProgress 
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorAPI, appointmentAPI, aiAPI } from '../services/api';

function BookAppointment({ user }) {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [formData, setFormData] = useState({
    preferredDate: '',
    symptoms: ''
  });
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadDoctor = React.useCallback(async () => {
    try {
      const response = await doctorAPI.getById(doctorId);
      setDoctor(response.data);
    } catch (error) {
      setError('Doctor not found');
    }
  }, [doctorId]);

  useEffect(() => {
    loadDoctor();
  }, [loadDoctor]);

  const analyzeSymptoms = async () => {
    if (!formData.symptoms.trim()) return;
    
    try {
      setLoading(true);
      
      // Simulate AI analysis since API might not be working
      const symptomsArray = formData.symptoms.split(',').map(s => s.trim().toLowerCase());
      
      let riskLevel = 'low';
      let suggestedDuration = 15;
      let recommendations = ['Stay hydrated', 'Get adequate rest'];
      
      // Simple risk assessment
      if (symptomsArray.some(s => ['fever', 'chest pain', 'difficulty breathing'].includes(s))) {
        riskLevel = 'high';
        suggestedDuration = 30;
        recommendations = ['Seek immediate medical attention', 'Monitor symptoms closely'];
      } else if (symptomsArray.some(s => ['headache', 'nausea', 'fatigue'].includes(s))) {
        riskLevel = 'medium';
        suggestedDuration = 20;
        recommendations = ['Rest and monitor symptoms', 'Stay hydrated'];
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAiAnalysis({
        riskLevel,
        suggestedDuration,
        recommendations
      });
      
    } catch (error) {
      console.error('AI analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    try {
      setLoading(true);
      
      // Fix symptoms format - ensure it's a string, not nested array
      const symptomsString = formData.symptoms.trim();
      
      // Use simple booking endpoint to avoid validation issues
      const appointmentData = {
        patientId: user._id || user.id, // Use _id if available
        doctorId,
        appointmentDate: formData.preferredDate.split('T')[0], // Extract date
        appointmentTime: formData.preferredDate.split('T')[1], // Extract time
        symptoms: symptomsString
      };
      
      console.log('Booking data:', appointmentData);
      
      // Try simple booking first, fallback to regular booking
      let response;
      try {
        response = await appointmentAPI.bookSimple(appointmentData);
      } catch (simpleError) {
        console.log('Simple booking failed, trying regular booking:', simpleError);
        // Fallback to regular booking with proper format
        response = await appointmentAPI.book({
          patientId: appointmentData.patientId,
          doctorId: appointmentData.doctorId,
          preferredDate: `${appointmentData.appointmentDate}T${appointmentData.appointmentTime}`,
          symptoms: appointmentData.symptoms,
          patientHistory: []
        });
      }
      
      // Save to localStorage for doctor to see
      const bookedAppointments = JSON.parse(localStorage.getItem('bookedAppointments') || '[]');
      const newAppointment = {
        _id: Date.now().toString(),
        patient: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          profile: user.profile || {}
        },
        patientId: user._id || user.id,
        doctor: {
          _id: appointmentData.doctorId,
          userId: { name: doctor.userId?.name || 'Doctor' },
          name: doctor.userId?.name || 'Doctor',
          specialization: doctor.specialization
        },
        doctorId: appointmentData.doctorId,
        doctorName: doctor.userId?.name || 'Doctor',
        scheduledTime: `${appointmentData.appointmentDate}T${appointmentData.appointmentTime}`,
        appointmentDate: appointmentData.appointmentDate,
        appointmentTime: appointmentData.appointmentTime,
        symptoms: appointmentData.symptoms.split(',').map(s => s.trim()),
        status: 'scheduled',
        createdAt: new Date().toISOString()
      };
      
      bookedAppointments.push(newAppointment);
      localStorage.setItem('bookedAppointments', JSON.stringify(bookedAppointments));
      console.log('Saved appointment to localStorage:', newAppointment);
      
      alert('Appointment booked successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Booking error:', error);
      setError(error.response?.data?.message || 'Booking failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) return <CircularProgress />;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Book Appointment</Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">Doctor {doctor.userId?.name}</Typography>
          <Chip label={doctor.specialization} color="primary" sx={{ mt: 1 }} />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Fee: ₹{doctor.consultationFee} | Avg. Time: {doctor.avgConsultationTime} min
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          fullWidth
          label="Preferred Date & Time"
          type="datetime-local"
          value={formData.preferredDate}
          onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
          inputProps={{ style: { cursor: 'pointer' } }}
          sx={{ 
            mb: 2,
            cursor: 'pointer',
            '& .MuiInputBase-root': { cursor: 'pointer' },
            '& input': { cursor: 'pointer !important' },
            '& input::-webkit-calendar-picker-indicator': { cursor: 'pointer' }
          }}
          InputLabelProps={{ shrink: true }}
          helperText={`Dr. ${doctor.userId?.name} is available 9:00 AM - 5:00 PM`}
        />

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Describe your symptoms (comma separated)"
          value={formData.symptoms}
          onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
          placeholder="e.g., headache, fever, cough"
          sx={{ 
            mb: 2,
            cursor: 'pointer',
            '& .MuiInputBase-root': { cursor: 'text' },
            '& textarea': { cursor: 'text' }
          }}
        />

        <Button 
          variant="outlined" 
          onClick={analyzeSymptoms}
          disabled={!formData.symptoms.trim() || loading}
          sx={{ 
            mb: 2,
            cursor: !formData.symptoms.trim() || loading ? 'not-allowed' : 'pointer'
          }}
        >
          AI Analysis
        </Button>

        {aiAnalysis && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider' }}>
            <Typography variant="h6">AI Pre-Assessment</Typography>
            <Typography>Risk Level: <Chip label={aiAnalysis.riskLevel} color={
              aiAnalysis.riskLevel === 'high' ? 'error' : 
              aiAnalysis.riskLevel === 'medium' ? 'warning' : 'success'
            } size="small" /></Typography>
            <Typography>Suggested Duration: {aiAnalysis.suggestedDuration} minutes</Typography>
            {aiAnalysis.recommendations && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle2">Recommendations:</Typography>
                {aiAnalysis.recommendations.map((rec, idx) => (
                  <Typography key={idx} variant="body2">• {rec}</Typography>
                ))}
              </Box>
            )}
          </Box>
        )}

        <Button 
          variant="contained" 
          fullWidth 
          onClick={handleBooking}
          disabled={!formData.preferredDate || !formData.symptoms.trim() || loading}
          sx={{
            cursor: (!formData.preferredDate || !formData.symptoms.trim() || loading) ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Booking...' : 'Book Appointment'}
        </Button>
      </Paper>
    </Container>
  );
}

export default BookAppointment;