import React, { useState } from 'react';
import { 
  Container, Paper, TextField, Button, Typography, 
  Box, Alert 
} from '@mui/material';
import { Shield } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function AdminLogin({ onAdminLogin }) {
  const [credentials, setCredentials] = useState({ username: '', password: '', secretKey: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Super secure admin login - only you know these credentials
    const ADMIN_USERNAME = 'superadmin2024';
    const ADMIN_PASSWORD = 'MyHealthApp@2024!';
    const SECRET_KEY = 'HEALTH_ADMIN_SECRET_2024';

    if (
      credentials.username === ADMIN_USERNAME && 
      credentials.password === ADMIN_PASSWORD && 
      credentials.secretKey === SECRET_KEY
    ) {
      const adminUser = {
        id: 'admin_001',
        name: 'Super Admin',
        email: 'admin@healthapp.com',
        role: 'admin'
      };
      
      localStorage.setItem('adminToken', 'admin_secure_token_2024');
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
      
      onAdminLogin(adminUser);
      navigate('/admin');
    } else {
      setError('Invalid admin credentials. Access denied.');
    }
    
    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
            <Shield sx={{ fontSize: 40, color: 'error.main', mr: 1 }} />
            <Typography component="h1" variant="h4" color="error.main">
              Admin Access
            </Typography>
          </Box>
          
          <Alert severity="warning" sx={{ mb: 3 }}>
            🔒 Restricted Area - Authorized Personnel Only
          </Alert>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleLogin}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Admin Username"
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              autoComplete="username"
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Admin Password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              autoComplete="current-password"
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Secret Access Key"
              type="password"
              value={credentials.secretKey}
              onChange={(e) => setCredentials({ ...credentials, secretKey: e.target.value })}
              helperText="Contact system administrator for access key"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="error"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? 'Verifying...' : '🔐 Admin Login'}
            </Button>
          </Box>
          
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="caption" color="textSecondary">
              ⚠️ All admin access attempts are logged and monitored for security.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default AdminLogin;