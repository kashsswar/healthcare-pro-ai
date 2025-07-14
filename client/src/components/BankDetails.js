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
      await fetch('/api/doctors/bank-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: doctor._id,
          ...bankInfo
        })
      });
      
      alert('Bank details saved! Payments will be auto-transferred (80% to you, 20% platform fee)');
      onClose();
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
          💰 You receive 80% of consultation fee directly in your bank account. 
          20% platform fee covers app maintenance, marketing, and AI features.
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
            <br />• 80% transferred to your account instantly
            <br />• 20% retained for platform services
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