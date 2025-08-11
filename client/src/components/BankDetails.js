import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, Box, Typography, Alert 
} from '@mui/material';
import { AccountBalance } from '@mui/icons-material';

function BankDetails({ open, onClose, doctor }) {
  const [bankInfo, setBankInfo] = useState({
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    accountHolderName: doctor?.userId?.name || ''
  });

  const handleSave = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/bank-details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: doctor._id || doctor.id,
          userType: 'doctor',
          ...bankInfo
        })
      });
      
      if (response.ok) {
        alert('Bank details saved! Payments will be auto-transferred (88% to you, 12% platform fee)');
        onClose();
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      alert('Failed to save bank details');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AccountBalance sx={{ mr: 1 }} />
          💳 Bank Account Setup
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          💰 You receive 88% of consultation fee directly in your bank account. 
          12% platform fee covers app maintenance, marketing, and AI features.
        </Alert>

        <TextField
          fullWidth
          label="Account Holder Name"
          value={bankInfo.accountHolderName}
          onChange={(e) => setBankInfo({...bankInfo, accountHolderName: e.target.value})}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Bank Account Number"
          value={bankInfo.accountNumber}
          onChange={(e) => setBankInfo({...bankInfo, accountNumber: e.target.value})}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="IFSC Code"
          value={bankInfo.ifscCode}
          onChange={(e) => setBankInfo({...bankInfo, ifscCode: e.target.value})}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Bank Name"
          value={bankInfo.bankName}
          onChange={(e) => setBankInfo({...bankInfo, bankName: e.target.value})}
          sx={{ mb: 2 }}
        />

        <Box sx={{ bgcolor: 'success.light', p: 2, borderRadius: 1 }}>
          <Typography variant="body2">
            ✅ <strong>Payment Process:</strong>
            <br />• Patient pays consultation fee
            <br />• 88% transferred to your account instantly
            <br />• 12% retained for platform services
            <br />• Daily settlement reports via email
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleSave}
          disabled={!bankInfo.accountNumber || !bankInfo.ifscCode}
        >
          💾 Save Bank Details
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default BankDetails;