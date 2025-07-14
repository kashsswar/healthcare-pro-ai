import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Box, Grid, Chip, Table, TableBody, 
  TableCell, TableHead, TableRow, Alert, LinearProgress 
} from '@mui/material';
import { Person, LocalHospital, AccessTime, SwapHoriz } from '@mui/icons-material';
import axios from 'axios';

const AdminQueueMonitor = () => {
  const [allQueues, setAllQueues] = useState({});
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchAllQueues();
    const interval = setInterval(fetchAllQueues, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAllQueues = async () => {
    try {
      const response = await axios.get('/api/appointments/all-queues');
      setAllQueues(response.data);
      
      // Calculate stats
      const totalPatients = Object.values(response.data).reduce((sum, doc) => sum + doc.totalPatients, 0);
      const totalDoctors = Object.keys(response.data).length;
      const inConsultation = Object.values(response.data).reduce((sum, doc) => 
        sum + doc.queue.filter(p => p.status === 'in-consultation').length, 0
      );
      const waiting = Object.values(response.data).reduce((sum, doc) => 
        sum + doc.queue.filter(p => p.status === 'waiting').length, 0
      );
      
      setStats({ totalPatients, totalDoctors, inConsultation, waiting });
    } catch (error) {
      console.error('Error fetching queues:', error);
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
      <Typography variant="h5" gutterBottom>📊 Real-time Queue Monitor</Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'primary.light' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Person sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h4">{stats.totalPatients || 0}</Typography>
              <Typography color="textSecondary">Total Patients</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'success.light' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <LocalHospital sx={{ fontSize: 40, color: 'success.main' }} />
              <Typography variant="h4">{stats.inConsultation || 0}</Typography>
              <Typography color="textSecondary">In Consultation</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'warning.light' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <AccessTime sx={{ fontSize: 40, color: 'warning.main' }} />
              <Typography variant="h4">{stats.waiting || 0}</Typography>
              <Typography color="textSecondary">Waiting</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'info.light' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <SwapHoriz sx={{ fontSize: 40, color: 'info.main' }} />
              <Typography variant="h4">{stats.totalDoctors || 0}</Typography>
              <Typography color="textSecondary">Active Doctors</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Alert severity="info" sx={{ mb: 3 }}>
        🔄 Real-time updates every 15 seconds | Free referral system active | No additional charges for patient transfers
      </Alert>

      {Object.entries(allQueues).map(([doctorId, doctorData]) => (
        <Card key={doctorId} sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                👨‍⚕️ Dr. {doctorData.doctor?.userId?.name} - {doctorData.doctor?.specialization}
              </Typography>
              <Chip 
                label={`${doctorData.totalPatients} patients`} 
                color="primary" 
              />
            </Box>

            {doctorData.queue.length > 0 ? (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Position</TableCell>
                    <TableCell>Patient</TableCell>
                    <TableCell>Age</TableCell>
                    <TableCell>Symptoms</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Est. Time</TableCell>
                    <TableCell>Special Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {doctorData.queue.map((patient, index) => (
                    <TableRow key={patient._id}>
                      <TableCell>{patient.queuePosition || index + 1}</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {patient.patientName}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {patient.phone}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {patient.symptoms?.join(', ')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={patient.status} 
                          color={getStatusColor(patient.status)} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={patient.priority} 
                          color={getPriorityColor(patient.priority)} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{patient.estimatedTime}</TableCell>
                      <TableCell>
                        {patient.referralNote && (
                          <Typography variant="caption" color="info.main">
                            📋 {patient.referralNote}
                          </Typography>
                        )}
                        {patient.priority === 'referred' && (
                          <Chip label="Free Referral" color="secondary" size="small" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Alert severity="success">
                ✅ No patients in queue - Doctor available
              </Alert>
            )}

            {doctorData.queue.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Queue Progress:
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(doctorData.queue.filter(p => p.status === 'completed').length / doctorData.totalPatients) * 100} 
                  sx={{ mt: 1 }}
                />
              </Box>
            )}
          </CardContent>
        </Card>
      ))}

      {Object.keys(allQueues).length === 0 && (
        <Alert severity="info">
          📋 No active queues at the moment
        </Alert>
      )}
    </Box>
  );
};

export default AdminQueueMonitor;