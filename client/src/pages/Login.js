import React, { useState } from 'react';
import { 
  Container, Paper, TextField, Button, Typography, 
  Box, Alert, Link 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.login(formData);
      const data = response.data;
      
      onLogin(data.user, data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      
      // Track failed login for security monitoring
      const failedLogins = JSON.parse(localStorage.getItem('failedLogins') || '[]');
      failedLogins.push({
        email: formData.email,
        timestamp: new Date().toISOString(),
        ip: '192.168.1.' + Math.floor(Math.random() * 255), // Simulated IP
        userAgent: navigator.userAgent
      });
      
      // Keep only last 50 failed attempts
      if (failedLogins.length > 50) {
        failedLogins.splice(0, failedLogins.length - 50);
      }
      
      localStorage.setItem('failedLogins', JSON.stringify(failedLogins));
      
      // Dispatch security event
      window.dispatchEvent(new CustomEvent('securityThreatDetected', {
        detail: { type: 'failed_login', email: formData.email }
      }));
      
      setError(error.response?.data?.message || 'Network error. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            HealthConnect AI
          </Typography>
          <Typography variant="h6" align="center" color="textSecondary" gutterBottom>
            Sign In
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
            
            <Box textAlign="center">
              <Link 
                component="button" 
                variant="body2" 
                onClick={() => navigate('/register')}
              >
                Don't have an account? Sign Up
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;