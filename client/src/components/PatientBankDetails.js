import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, Box, Typography, Alert 
} from '@mui/material';
import { CreditCard } from '@mui/icons-material';

function PatientBankDetails({ open, onClose, onSave }) {
  const [bankInfo, setBankInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: ''
  });

  const handleSave = () => {
    onSave(bankInfo);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CreditCard sx={{ mr: 1 }} />
          💳 Payment Method
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          🔒 Secure payment for appointment booking. Your card details are encrypted.
        </Alert>

        <TextField
          fullWidth
          label="Card Holder Name"
          value={bankInfo.cardHolderName}
          onChange={(e) => setBankInfo({...bankInfo, cardHolderName: e.target.value})}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Card Number"
          value={bankInfo.cardNumber}
          onChange={(e) => setBankInfo({...bankInfo, cardNumber: e.target.value})}
          placeholder="1234 5678 9012 3456"
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Expiry Date"
            value={bankInfo.expiryDate}
            onChange={(e) => setBankInfo({...bankInfo, expiryDate: e.target.value})}
            placeholder="MM/YY"
            sx={{ flex: 1 }}
          />
          <TextField
            label="CVV"
            value={bankInfo.cvv}
            onChange={(e) => setBankInfo({...bankInfo, cvv: e.target.value})}
            placeholder="123"
            sx={{ flex: 1 }}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleSave}
          disabled={!bankInfo.cardNumber || !bankInfo.cvv}
        >
          💾 Save Payment Method
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PatientBankDetails;