import React, { useState, useEffect } from 'react';
import { 
  Container, Paper, TextField, Button, Typography, 
  Box, Alert, Link, FormControl, InputLabel, Select, MenuItem, Autocomplete 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import axios from 'axios';

function Register({ onLogin }) {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', role: 'patient',
    specialization: '', customSpecialization: '', experience: '', consultationFee: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [specializations, setSpecializations] = useState([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSpecializations();
  }, []);

  const fetchSpecializations = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const response = await axios.get(`${apiUrl}/api/doctors/specializations`);
      setSpecializations(response.data);
    } catch (error) {
      console.error('Error fetching specializations:', error);
    }
  };

  const handleSpecializationChange = (value) => {
    setFormData({ ...formData, specialization: value, customSpecialization: '' });
    setShowCustomInput(value === 'Other (Please Specify)');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      
      // Use custom specialization if provided
      const finalFormData = {
        ...formData,
        specialization: showCustomInput && formData.customSpecialization 
          ? formData.customSpecialization 
          : formData.specialization
      };
      
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalFormData)
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.user, data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Registration failed. Please check your details.');
      }
    } catch (error) {
      setError('Network error. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Join HealthConnect AI
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal" required fullWidth label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              margin="normal" required fullWidth label="Email" type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              margin="normal" required fullWidth label="Password" type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <TextField
              margin="normal" required fullWidth label="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>I am a</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <MenuItem value="patient">Patient</MenuItem>
                <MenuItem value="doctor">Doctor</MenuItem>
              </Select>
            </FormControl>

            {formData.role === 'doctor' && (
              <>
                <Autocomplete
                  options={specializations}
                  value={formData.specialization || null}
                  onChange={(event, newValue) => handleSpecializationChange(newValue || '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Specialization"
                      margin="normal"
                      required
                      fullWidth
                      placeholder="Search or select specialization..."
                    />
                  )}
                  filterOptions={(options, { inputValue }) => {
                    const filtered = options.filter((option) =>
                      option.toLowerCase().includes(inputValue.toLowerCase())
                    );
                    return filtered;
                  }}
                />
                {showCustomInput && (
                  <TextField
                    margin="normal" required fullWidth 
                    label="Please specify your specialization"
                    value={formData.customSpecialization}
                    onChange={(e) => setFormData({ ...formData, customSpecialization: e.target.value })}
                    placeholder="e.g., Interventional Cardiology, Pediatric Oncology"
                  />
                )}
                <TextField
                  margin="normal" required fullWidth label="Years of Experience" type="number"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                />
                <TextField
                  margin="normal" required fullWidth label="Consultation Fee (₹)" type="number"
                  value={formData.consultationFee}
                  onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                />
              </>
            )}

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
            
            <Box textAlign="center">
              <Link component="button" variant="body2" onClick={() => navigate('/login')}>
                Already have an account? Sign In
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Register;