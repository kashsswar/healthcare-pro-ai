import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Select, MenuItem, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LocalHospital } from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const { currentLanguage, changeLanguage, t } = useLanguage();
  
  const languages = [
    { code: 'en', name: '🇬🇧 English' },
    { code: 'hi', name: '🇮🇳 हिंदी' },
    { code: 'ta', name: '🇮🇳 தமிழ்' },
    { code: 'te', name: '🇮🇳 తెలుగు' },
    { code: 'bn', name: '🇮🇳 বাংলা' }
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <LocalHospital sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {t('appName')}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ mr: 2 }}>
            <Select
              value={currentLanguage}
              onChange={(e) => changeLanguage(e.target.value)}
              sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}
            >
              {languages.map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>{lang.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button color="inherit" onClick={() => {
            navigate('/dashboard');
            window.location.href = '/dashboard';
          }}>
            {t('home')}
          </Button>
          {user.role === 'patient' && (
            <>
              <Button color="inherit" onClick={() => navigate('/doctors')}>
                {t('findDoctor')}
              </Button>
              <Button color="inherit" onClick={() => navigate('/health-recommendations')}>
                {t('healthTips')}
              </Button>
            </>
          )}
          {user.role === 'doctor' && (
            <Button color="inherit" onClick={() => navigate('/queue/1')}>
              {t('myQueue')}
            </Button>
          )}
          <Button color="inherit" onClick={onLogout}>
            {t('logout')} ({user.name})
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;