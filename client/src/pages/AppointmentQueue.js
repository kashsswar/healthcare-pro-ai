import React, { useState, useEffect } from 'react';
import { 
  Container, Paper, Typography, List, ListItem, ListItemText, 
  Chip, Box, Button, LinearProgress 
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { appointmentAPI } from '../services/api';
import ReferPatient from '../components/ReferPatient';

function AppointmentQueue({ user, socket }) {
  const { doctorId } = useParams();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [referPatient, setReferPatient] = useState(null);

  const loadQueue = React.useCallback(async () => {
    try {
      const response = await appointmentAPI.getQueue(doctorId);
      setQueue(response.data);
    } catch (error) {
      console.error('Queue load error:', error);
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    loadQueue();
    
    if (socket) {
      socket.on('appointment-rescheduled', () => loadQueue());
      socket.on('consultation-started', () => loadQueue());
      socket.on('new-appointment', () => loadQueue());
    }
  }, [socket, doctorId, loadQueue]);

  const startConsultation = async (appointmentId) => {
    try {
      await appointmentAPI.startConsultation(appointmentId);
      loadQueue();
    } catch (error) {
      console.error('Start consultation error:', error);
    }
  };

  const completeConsultation = async (appointmentId) => {
    try {
      await appointmentAPI.completeConsultation(appointmentId, {
        diagnosis: 'Consultation completed',
        prescription: [],
        notes: 'Standard consultation',
        followUpRequired: false
      });
      loadQueue();
    } catch (error) {
      console.error('Complete consultation error:', error);
    }
  };

  if (loading) return <LinearProgress />;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Appointment Queue</Typography>
        
        {queue.length === 0 ? (
          <Typography color="textSecondary">No appointments in queue</Typography>
        ) : (
          <List>
            {queue.map((appointment, index) => (
              <ListItem key={appointment._id} divider>
                <ListItemText
                  primary={`${index + 1}. ${appointment.patient?.name}`}
                  secondary={
                    <Box>
                      <Typography variant="body2">
                        Scheduled: {new Date(appointment.scheduledTime).toLocaleString()}
                      </Typography>
                      <Typography variant="body2">
                        Symptoms: {appointment.symptoms?.join(', ')}
                      </Typography>
                      <Typography variant="body2">
                        Wait Time: ~{appointment.estimatedWaitTime} minutes
                      </Typography>
                      {appointment.aiPreAssessment && (
                        <Typography variant="body2">
                          AI Risk: <Chip 
                            label={appointment.aiPreAssessment.riskLevel} 
                            size="small"
                            color={
                              appointment.aiPreAssessment.riskLevel === 'high' ? 'error' : 
                              appointment.aiPreAssessment.riskLevel === 'medium' ? 'warning' : 'success'
                            }
                          />
                        </Typography>
                      )}
                    </Box>
                  }
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Chip 
                    label={appointment.status} 
                    color={
                      appointment.status === 'scheduled' ? 'primary' :
                      appointment.status === 'in-progress' ? 'warning' : 'success'
                    }
                  />
                  {user.role === 'doctor' && (
                    <>
                      {appointment.status === 'scheduled' && (
                        <Button 
                          size="small" 
                          variant="contained"
                          onClick={() => startConsultation(appointment._id)}
                        >
                          Start
                        </Button>
                      )}
                      {appointment.status === 'in-progress' && (
                        <>
                          <Button 
                            size="small" 
                            variant="outlined"
                            onClick={() => completeConsultation(appointment._id)}
                            sx={{ mb: 1 }}
                          >
                            Complete
                          </Button>
                          <Button 
                            size="small" 
                            variant="text"
                            onClick={() => setReferPatient(appointment)}
                            color="secondary"
                          >
                            🔄 Refer
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
      
      <ReferPatient 
        open={!!referPatient}
        onClose={() => setReferPatient(null)}
        appointment={referPatient}
        currentDoctor={{ _id: doctorId, location: { city: 'Mumbai' } }}
      />
    </Container>
  );
}

export default AppointmentQueue;