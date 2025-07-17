import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Box, Typography, IconButton, Snackbar, Alert 
} from '@mui/material';
import { Share, WhatsApp, ContentCopy, Phone } from '@mui/icons-material';

function ShareDoctor({ doctor, open, onClose }) {
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  if (!doctor) {
    return null;
  }

  const shareContent = {
    message: `🏥 मिला बेहतरीन डॉक्टर! Found excellent doctor!\n\n👨‍⚕️ Dr. ${doctor.userId?.name || 'Doctor'}\n🏥 ${doctor.specialization || 'Healthcare'}\n⭐ Rating: ${doctor.finalRating || doctor.rating || 4.5}/5\n💰 Fee: ₹${doctor.consultationFee || 500}\n📱 Book online instantly!\n\n#HealthCare #Doctor #${doctor.specialization || 'Healthcare'}`,
    incentive: '🎁 Share and help others find quality healthcare!'
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareContent.message + '\n\n' + shareContent.incentive)}`;
    window.open(whatsappUrl, '_blank');
    trackShare('whatsapp');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareContent.message);
    setSnackbar({ open: true, message: 'Link copied! Share with friends 📋' });
    trackShare('social');
  };

  const handleReferralShare = () => {
    const referralMessage = `🏥 मैंने इस डॉक्टर से इलाज कराया है, बहुत अच्छा है!\n\n${shareContent.message}\n\n${shareContent.incentive}`;
    navigator.clipboard.writeText(referralMessage);
    setSnackbar({ open: true, message: 'Referral message copied! Help friends find quality healthcare 🎁' });
    trackShare('referral');
  };

  const trackShare = async (shareType) => {
    try {
      await fetch('/api/admin/share-doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: doctor._id || doctor.id,
          shareType,
          referrerPhone: localStorage.getItem('userPhone')
        })
      });
    } catch (error) {
      console.error('Share tracking error:', error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Share color="primary" />
            <Typography variant="h6">Share Dr. {doctor.userId?.name || 'Doctor'}</Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
            💡 Share करके अपने दोस्तों की मदद करें!
            Help friends find quality healthcare!
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<WhatsApp />}
              onClick={handleWhatsAppShare}
              fullWidth
              sx={{ py: 1.5 }}
            >
              📱 WhatsApp पर Share करें / Share on WhatsApp
            </Button>

            <Button
              variant="outlined"
              startIcon={<Phone />}
              onClick={handleReferralShare}
              fullWidth
              sx={{ py: 1.5 }}
            >
              👥 दोस्तों को Refer करें / Refer Friends
            </Button>

            <Button
              variant="outlined"
              startIcon={<ContentCopy />}
              onClick={handleCopyLink}
              fullWidth
              sx={{ py: 1.5 }}
            >
              📋 Link Copy करें / Copy Link
            </Button>
          </Box>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              🎁 Sharing Benefits:
            </Typography>
            <Typography variant="body2">
              • Help friends find quality healthcare
              • Support local doctors
              • Build a healthier community
              • Spread awareness about online consultations
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity="success" onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ShareDoctor;