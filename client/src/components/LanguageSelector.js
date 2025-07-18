import React from 'react';
import { Select, MenuItem, FormControl, Box, Typography } from '@mui/material';
import { Language } from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';

function LanguageSelector() {
  const { currentLanguage, changeLanguage, getAvailableLanguages } = useLanguage();
  const languages = getAvailableLanguages();

  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <Select
        value={currentLanguage}
        onChange={(e) => changeLanguage(e.target.value)}
        startAdornment={<Language sx={{ mr: 1, color: 'text.secondary' }} />}
        sx={{ 
          '& .MuiSelect-select': { 
            display: 'flex', 
            alignItems: 'center',
            py: 1
          }
        }}
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">{lang.flag}</Typography>
              <Typography variant="body2">{lang.name}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default LanguageSelector;