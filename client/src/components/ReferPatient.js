import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Select, MenuItem, FormControl, 
  InputLabel, Typography, Box, Alert 
} from '@mui/material';
import { doctorAPI } from '../services/api';

function ReferPatient({ open, onClose, appointment, currentDoctor }) {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const referralReasons = [
    'Requires specialist consultation',
    'Outside my area of expertise', 
    'Patient needs advanced treatment',
    'Better suited for this condition',
    'Emergency case - immediate attention needed',
    'Patient preference for specialist'
  ];

  useEffect(() => {
    if (open) {
      loadDoctors();
    }
  }, [open]);

  const loadDoctors = async () => {
    try {
      const response = await doctorAPI.getAll();
      // Filter doctors in same city, exclude current doctor
      const sameCityDoctors = response.data.filter(doc => 
        doc._id !== currentDoctor._id && 
        doc.location?.city === currentDoctor.location?.city
      );
      setDoctors(sameCityDoctors);
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
  };

  const handleRefer = async () => {
    if (!selectedDoctor || !reason) return;

    try {
      setLoading(true);
      
      // Create referral
      await fetch('/api/appointments/refer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: appointment._id,
          fromDoctorId: currentDoctor._id,
          toDoctorId: selectedDoctor,
          reason,
          patientId: appointment.patient._id
        })
      });

      alert('Patient referred successfully! Patient will be notified.');
      onClose();
    } catch (error) {
      console.error('Referral error:', error);
      alert('Failed to refer patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        🔄 Refer Patient to Another Doctor
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Patient: {appointment?.patient?.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Symptoms: {appointment?.symptoms?.join(', ')}
          </Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 2 }}>
          💡 Referring builds trust and helps patient get best care
        </Alert>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select Doctor in {currentDoctor.location?.city}</InputLabel>
          <Select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
          >
            {doctors.map((doctor) => (
              <MenuItem key={doctor._id} value={doctor._id}>
                Dr. {doctor.userId?.name} - {doctor.specialization} 
                (₹{doctor.consultationFee})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Reason for Referral</InputLabel>
          <Select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            {referralReasons.map((reasonText, index) => (
              <MenuItem key={index} value={reasonText}>
                {reasonText}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          multiline
          rows={2}
          label="Additional Notes (Optional)"
          placeholder="Any specific instructions or patient details..."
          sx={{ mb: 2 }}
        />

        <Box sx={{ bgcolor: 'success.light', p: 2, borderRadius: 1 }}>
          <Typography variant="body2">
            ✅ Benefits of Referral:
            • Patient gets specialized care
            • Builds your professional reputation  
            • Creates doctor network
            • Patient trusts your judgment
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleRefer}
          disabled={!selectedDoctor || !reason || loading}
        >
          {loading ? 'Referring...' : '🔄 Refer Patient'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReferPatient;