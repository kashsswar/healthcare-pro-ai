import React, { useState, useEffect } from 'react';
import { 
  Container, Paper, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, Select, MenuItem, 
  FormControl, InputLabel, Chip, Box 
} from '@mui/material';
import { Star, TrendingUp, Visibility } from '@mui/icons-material';

function AdminPanel() {
  const [doctors, setDoctors] = useState([]);
  const [boostDialog, setBoostDialog] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [boostType, setBoostType] = useState('rating');
  const [boostValue, setBoostValue] = useState(0.5);
  const [reason, setReason] = useState('');

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const response = await fetch('/api/doctors');
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
  };

  const handleBoost = async () => {
    try {
      await fetch('/api/admin/boost-doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: selectedDoctor._id,
          boostType,
          boostValue: parseFloat(boostValue),
          reason
        })
      });
      
      alert('Doctor boosted successfully!');
      setBoostDialog(false);
      loadDoctors();
    } catch (error) {
      alert('Failed to boost doctor');
    }
  };

  const openBoostDialog = (doctor) => {
    setSelectedDoctor(doctor);
    setBoostDialog(true);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        👑 Admin Panel - Doctor Management
      </Typography>
      
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          👥 Doctor Management
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Doctor</TableCell>
                <TableCell>Specialization</TableCell>
                <TableCell>Current Rating</TableCell>
                <TableCell>Admin Boost</TableCell>
                <TableCell>Final Rating</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {doctors.map((doctor) => (
                <TableRow key={doctor._id}>
                  <TableCell>
                    <Box>
                      <Typography variant="body1">Dr. {doctor.userId?.name}</Typography>
                      {doctor.isFeatured && <Chip label="Featured" color="success" size="small" />}
                    </Box>
                  </TableCell>
                  <TableCell>{doctor.specialization}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Star color="warning" />
                      {doctor.rating}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={`+${doctor.adminBoostRating || 0}`} 
                      color="primary" 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Star color="warning" />
                      <Typography variant="h6" color="primary">
                        {doctor.finalRating || doctor.rating}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="contained" 
                      size="small"
                      onClick={() => openBoostDialog(doctor)}
                      startIcon={<TrendingUp />}
                    >
                      Boost
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={boostDialog} onClose={() => setBoostDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          🚀 Boost Dr. {selectedDoctor?.userId?.name}
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Boost Type</InputLabel>
              <Select
                value={boostType}
                onChange={(e) => setBoostType(e.target.value)}
              >
                <MenuItem value="rating">⭐ Rating Boost</MenuItem>
                <MenuItem value="featured">🌟 Featured Doctor</MenuItem>
                <MenuItem value="visibility">👁️ Visibility Boost</MenuItem>
              </Select>
            </FormControl>

            {boostType === 'rating' && (
              <TextField
                fullWidth
                label="Rating Boost (0.1 to 1.0)"
                type="number"
                value={boostValue}
                onChange={(e) => setBoostValue(e.target.value)}
                inputProps={{ min: 0.1, max: 1.0, step: 0.1 }}
                helperText="Current: 4.2 → Boosted: 4.7 (with +0.5 boost)"
              />
            )}

            <TextField
              fullWidth
              label="Reason for Boost"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Excellent patient care, New doctor support, Quality service"
            />

            <Box sx={{ bgcolor: 'info.light', p: 2, borderRadius: 1 }}>
              <Typography variant="body2">
                💡 <strong>Admin Powers:</strong>
                <br />• Rating Boost: Instantly increase doctor's rating
                <br />• Featured: Show doctor at top of search results  
                <br />• Visibility: Appear more frequently in recommendations
              </Typography>
            </Box>

            <Box sx={{ bgcolor: 'warning.light', p: 2, borderRadius: 1 }}>
              <Typography variant="body2">
                ⚠️ <strong>Use Responsibly:</strong>
                <br />Only boost doctors who provide quality care. This affects patient trust.
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setBoostDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleBoost}
            disabled={!reason}
          >
            🚀 Apply Boost
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default AdminPanel;