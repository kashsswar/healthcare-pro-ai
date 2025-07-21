import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Table, TableBody, TableCell, 
  TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Chip, Box, Tabs, Tab, Alert
} from '@mui/material';
import { Delete, Person, LocalHospital } from '@mui/icons-material';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';

function AdminUsersManager() {
  const { t } = useLanguage();
  const [users, setUsers] = useState({ patients: [], doctors: [] });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null, type: '' });
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await axios.get('/api/admin-users/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const { user, type } = deleteDialog;
      const endpoint = type === 'doctor' ? `/api/admin-users/doctor/${user._id}` : `/api/admin-users/patient/${user._id}`;
      
      await axios.delete(endpoint);
      setDeleteDialog({ open: false, user: null, type: '' });
      loadUsers();
      alert(`${type} deleted successfully`);
    } catch (error) {
      alert('Error deleting user: ' + error.response?.data?.message);
    }
  };

  const openDeleteDialog = (user, type) => {
    setDeleteDialog({ open: true, user, type });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {t('usersManagement')}
      </Typography>

      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
        <Tab label={`👨‍⚕️ Doctors (${users.doctors.length})`} />
        <Tab label={`🧑‍🤝‍🧑 Patients (${users.patients.length})`} />
      </Tabs>

      {tabValue === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Doctors Management
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Specialization</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Experience</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.doctors.map((doctor) => (
                  <TableRow key={doctor._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocalHospital sx={{ mr: 1 }} />
                        Dr. {doctor.userId?.name || 'Unknown'}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={doctor.specialization} size="small" />
                    </TableCell>
                    <TableCell>{doctor.userId?.email}</TableCell>
                    <TableCell>{doctor.experience} years</TableCell>
                    <TableCell>
                      {(doctor.finalRating || doctor.rating || 0).toFixed(1)} ⭐
                    </TableCell>
                    <TableCell>
                      <Button
                        startIcon={<Delete />}
                        color="error"
                        variant="contained"
                        size="small"
                        onClick={() => openDeleteDialog(doctor, 'doctor')}
                        sx={{ 
                          bgcolor: 'error.main',
                          '&:hover': { bgcolor: 'error.dark' },
                          fontWeight: 'bold'
                        }}
                      >
                        🗑️ DELETE
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {tabValue === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Patients Management
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.patients.map((patient) => (
                  <TableRow key={patient._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Person sx={{ mr: 1 }} />
                        {patient.name}
                      </Box>
                    </TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>
                      {new Date(patient.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        startIcon={<Delete />}
                        color="error"
                        variant="contained"
                        size="small"
                        onClick={() => openDeleteDialog(patient, 'patient')}
                        sx={{ 
                          bgcolor: 'error.main',
                          '&:hover': { bgcolor: 'error.dark' },
                          fontWeight: 'bold'
                        }}
                      >
                        🗑️ DELETE
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, user: null, type: '' })}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            ⚠️ <strong>PERMANENT DELETION WARNING</strong>
          </Alert>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            Delete {deleteDialog.type}: "{deleteDialog.user?.name || deleteDialog.user?.userId?.name}"?
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            This will <strong>PERMANENTLY DELETE</strong>:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            <li>User profile and personal information</li>
            <li>All appointment history and medical records</li>
            <li>Payment history and transactions</li>
            <li>Reviews and ratings</li>
            {deleteDialog.type === 'doctor' && <li>Doctor specialization and availability data</li>}
          </Box>
          <Typography variant="body2" color="error" sx={{ fontWeight: 'bold' }}>
            ❌ This action CANNOT be undone. The data will be lost forever.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setDeleteDialog({ open: false, user: null, type: '' })}
            variant="outlined"
            size="large"
          >
            ❌ Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            size="large"
            sx={{ 
              bgcolor: 'error.main',
              '&:hover': { bgcolor: 'error.dark' },
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}
          >
            🗑️ PERMANENTLY DELETE
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminUsersManager;