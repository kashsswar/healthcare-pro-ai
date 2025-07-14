import React, { useState } from 'react';
import { 
  Fab, Dialog, DialogTitle, DialogContent, FormControlLabel, 
  Switch, Slider, Typography, Box, IconButton 
} from '@mui/material';
import { Accessibility, Close, TextFields, Contrast, VolumeUp } from '@mui/icons-material';

function AccessibilityPanel() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState({
    largeText: false,
    highContrast: false,
    voiceEnabled: false,
    fontSize: 16
  });

  const handleSettingChange = (setting, value) => {
    const newSettings = { ...settings, [setting]: value };
    setSettings(newSettings);
    localStorage.setItem('accessibilitySettings', JSON.stringify(newSettings));
    applySettings(newSettings);
  };

  const applySettings = (settings) => {
    const root = document.documentElement;
    
    if (settings.largeText) {
      root.style.fontSize = `${settings.fontSize}px`;
    } else {
      root.style.fontSize = '14px';
    }
    
    if (settings.highContrast) {
      root.style.filter = 'contrast(150%) brightness(120%)';
    } else {
      root.style.filter = 'none';
    }
    
    // Store voice setting for voice assistant
    localStorage.setItem('voiceEnabled', settings.voiceEnabled);
  };

  React.useEffect(() => {
    const saved = localStorage.getItem('accessibilitySettings');
    if (saved) {
      const savedSettings = JSON.parse(saved);
      setSettings(savedSettings);
      applySettings(savedSettings);
    }
  }, []);

  return (
    <>
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 80, right: 16, zIndex: 1000 }}
        onClick={() => setOpen(true)}
      >
        <Accessibility />
      </Fab>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              ♿ सुविधा सेटिंग / Accessibility Settings
            </Typography>
            <IconButton onClick={() => setOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.largeText}
                  onChange={(e) => handleSettingChange('largeText', e.target.checked)}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextFields />
                  <Typography>बड़े अक्षर / Large Text</Typography>
                </Box>
              }
            />

            {settings.largeText && (
              <Box sx={{ px: 2 }}>
                <Typography gutterBottom>Font Size: {settings.fontSize}px</Typography>
                <Slider
                  value={settings.fontSize}
                  onChange={(e, value) => handleSettingChange('fontSize', value)}
                  min={14}
                  max={24}
                  step={2}
                  marks
                />
              </Box>
            )}

            <FormControlLabel
              control={
                <Switch
                  checked={settings.highContrast}
                  onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Contrast />
                  <Typography>तेज़ रंग / High Contrast</Typography>
                </Box>
              }
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.voiceEnabled}
                  onChange={(e) => handleSettingChange('voiceEnabled', e.target.checked)}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VolumeUp />
                  <Typography>आवाज़ सहायक / Voice Assistant</Typography>
                </Box>
              }
            />

            <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
              <Typography variant="body2">
                💡 These settings help people with vision or reading difficulties use the app easily.
              </Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AccessibilityPanel;