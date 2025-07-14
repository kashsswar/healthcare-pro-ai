import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Box, Chip, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, 
  InputLabel, Alert, Grid, Avatar, IconButton 
} from '@mui/material';
import { 
  AccessTime, Person, Phone, LocalHospital, SwapHoriz, 
  CheckCircle, Schedule, Warning 
} from '@mui/icons-material';
import axios from 'axios';

const DoctorQueue = ({ doctorId }) => {
  const [queueData, setQueueData] = useState({});
  const [referralDialog, setReferralDialog] = useState({ open: false, patient: null });
  const [doctors, setDoctors] = useState([]);
  const [referralData, setReferralData] = useState({ toDoctorId: '', reason: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchQueue();
    fetchDoctors();
    const interval = setInterval(fetchQueue, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [doctorId]);

  const fetchQueue = async () => {
    try {
      const response = await axios.get(`/api/appointments/doctor/${doctorId}/queue`);
      setQueueData(response.data);
    } catch (error) {
      console.error('Error fetching queue:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('/api/doctors');
      setDoctors(response.data.filter(d => d._id !== doctorId));
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const updateStatus = async (appointmentId, status) => {
    try {
      await axios.post(`/api/appointments/${appointmentId}/status`, { status });
      setMessage(`✅ Patient status updated to ${status}`);
      fetchQueue();
    } catch (error) {
      setMessage('❌ Error updating status');
    }
  };

  const handleRefer = async () => {
    try {
      const response = await axios.post('/api/appointments/refer', {
        appointmentId: referralDialog.patient._id,
        fromDoctorId: doctorId,
        toDoctorId: referralData.toDoctorId,
        reason: referralData.reason,
        patientId: referralDialog.patient.patientId
      });
      
      setMessage(response.data.notification);
      setReferralDialog({ open: false, patient: null });
      setReferralData({ toDoctorId: '', reason: '' });
      fetchQueue();
    } catch (error) {
      setMessage('❌ Error referring patient');
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'referred': return 'secondary';
      default: return 'primary';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'in-consultation': return 'success';
      case 'waiting': return 'warning';
      case 'referred': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>👥 Patient Queue</Typography>
      
      {message && (
        <Alert severity={message.includes('✅') ? 'success' : 'error'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'primary.light' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4">{queueData.totalPatients || 0}</Typography>
              <Typography color="textSecondary">Total Patients</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'success.light' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4">{queueData.estimatedWaitTime || 0} min</Typography>
              <Typography color="textSecondary">Est. Wait Time</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'warning.light' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4">
                {queueData.currentPatient ? 'In Progress' : 'Ready'}
              </Typography>
              <Typography color="textSecondary">Current Status</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        {queueData.queue?.map((patient, index) => (
          <Card key={patient._id} sx={{ mb: 2, border: patient.status === 'in-consultation' ? '2px solid green' : 'none' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: getPriorityColor(patient.priority) + '.main' }}>
                    {patient.queuePosition || index + 1}
                  </Avatar>
                  
                  <Box>
                    <Typography variant="h6">{patient.patientName}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <Person fontSize="small" />
                      <Typography variant="body2">Age: {patient.age}</Typography>
                      <Phone fontSize="small" />
                      <Typography variant="body2">{patient.phone}</Typography>
                    </Box>
                    
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        Symptoms: {patient.symptoms?.join(', ')}
                      </Typography>
                      {patient.referralNote && (
                        <Typography variant="body2" color="info.main" sx={{ mt: 0.5 }}>
                          📋 {patient.referralNote}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip 
                      label={patient.status} 
                      color={getStatusColor(patient.status)} 
                      size="small" 
                    />
                    <Chip 
                      label={patient.priority} 
                      color={getPriorityColor(patient.priority)} 
                      size="small" 
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime fontSize="small" />
                    <Typography variant="body2">{patient.estimatedTime}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    {patient.status === 'waiting' && (
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="success"
                        startIcon={<CheckCircle />}
                        onClick={() => updateStatus(patient._id, 'in-consultation')}
                      >
                        Start
                      </Button>
                    )}
                    
                    {patient.status === 'in-consultation' && (
                      <>
                        <Button 
                          size="small" 
                          variant="contained" 
                          color="primary"
                          onClick={() => updateStatus(patient._id, 'completed')}
                        >
                          Complete
                        </Button>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="warning"
                          startIcon={<SwapHoriz />}
                          onClick={() => setReferralDialog({ open: true, patient })}
                        >
                          Refer
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Referral Dialog */}
      <Dialog open={referralDialog.open} onClose={() => setReferralDialog({ open: false, patient: null })}>
        <DialogTitle>
          🔄 Refer Patient: {referralDialog.patient?.patientName}
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            ✅ No additional charge for patient or referring doctor
          </Alert>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Refer to Doctor</InputLabel>
            <Select 
              value={referralData.toDoctorId} 
              onChange={(e) => setReferralData({...referralData, toDoctorId: e.target.value})}
            >
              {doctors.map(doctor => (
                <MenuItem key={doctor._id} value={doctor._id}>
                  Dr. {doctor.userId?.name} - {doctor.specialization}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Reason for Referral"
            value={referralData.reason}
            onChange={(e) => setReferralData({...referralData, reason: e.target.value})}
            multiline
            rows={3}
            placeholder="e.g., Requires specialist consultation, Outside my expertise"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReferralDialog({ open: false, patient: null })}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleRefer}
            disabled={!referralData.toDoctorId || !referralData.reason}
          >
            Refer Patient (Free)
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorQueue;