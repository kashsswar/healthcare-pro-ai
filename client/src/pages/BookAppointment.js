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
      const symptoms = formData.symptoms.split(',').map(s => s.trim());
      const analysisResponse = await aiAPI.analyzeSymptoms(symptoms, user.profile?.medicalHistory || []);
      setAiAnalysis(analysisResponse.data.analysis);
    } catch (error) {
      console.error('AI analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    try {
      setLoading(true);
      const symptoms = formData.symptoms.split(',').map(s => s.trim());
      
      const response = await appointmentAPI.book({
        patientId: user.id,
        doctorId,
        preferredDate: formData.preferredDate,
        symptoms,
        patientHistory: user.profile?.medicalHistory || []
      });

      alert('Appointment booked successfully!');
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Booking failed');
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
          <Typography variant="h6">Dr. {doctor.userId?.name}</Typography>
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
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Describe your symptoms (comma separated)"
          value={formData.symptoms}
          onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
          placeholder="e.g., headache, fever, cough"
          sx={{ mb: 2 }}
        />

        <Button 
          variant="outlined" 
          onClick={analyzeSymptoms}
          disabled={!formData.symptoms.trim() || loading}
          sx={{ mb: 2 }}
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
        >
          {loading ? 'Booking...' : 'Book Appointment'}
        </Button>
      </Paper>
    </Container>
  );
}

export default BookAppointment;