import React from 'react';
import { FormControl, Select, MenuItem, Box, Typography } from '@mui/material';
import { useLanguage } from '../utils/languageContext';

function LanguageSelector() {
  const { language, changeLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <Select
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
        displayEmpty
        sx={{ color: 'white' }}
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>{lang.flag}</Typography>
              <Typography>{lang.name}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default LanguageSelector;