import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, Box, Typography, Alert, Card, CardContent 
} from '@mui/material';
import { AccountBalance, CreditCard } from '@mui/icons-material';

function PatientBankSetup({ open, onClose, patient }) {
  const [bankInfo, setBankInfo] = useState({
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    accountHolderName: patient?.name || ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (patient && open) {
      loadBankDetails();
    }
  }, [patient, open]);

  useEffect(() => {
    if (patient) {
      setBankInfo(prev => ({
        ...prev,
        accountHolderName: patient.name || ''
      }));
    }
  }, [patient]);

  const loadBankDetails = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/bank-details/patient/${patient._id || patient.id}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.accountNumber) {
          setBankInfo({
            accountNumber: data.accountNumber || '',
            ifscCode: data.ifscCode || '',
            bankName: data.bankName || '',
            accountHolderName: data.accountHolderName || patient.name || ''
          });
        }
      }
    } catch (error) {
      console.error('Error loading bank details:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const userId = patient._id || patient.id;
      console.log('Saving bank details for user:', userId);
      console.log('Bank info:', bankInfo);
      
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const payload = {
        userId,
        userType: 'patient',
        ...bankInfo
      };
      
      console.log('Sending payload:', payload);
      
      const response = await fetch(`${apiUrl}/api/bank-details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const savedData = await response.json();
        console.log('Bank details saved successfully:', savedData);
        alert('Bank details saved! Refunds will be processed to this account.');
        // Trigger a custom event to refresh parent components
        window.dispatchEvent(new CustomEvent('bankDetailsUpdated'));
        onClose();
      } else {
        const errorText = await response.text();
        console.error('Save failed:', errorText);
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving bank details:', error);
      alert('Failed to save bank details: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AccountBalance sx={{ mr: 1 }} />
          🏦 Bank Account Setup
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          💰 Add your bank account for appointment refunds and wallet withdrawals.
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
            ✅ <strong>Refund Process:</strong>
            <br />• Cancelled appointments refunded instantly
            <br />• Wallet withdrawals processed daily
            <br />• Secure bank-grade encryption
            <br />• Email notifications for all transactions
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleSave}
          disabled={!bankInfo.accountNumber || !bankInfo.ifscCode || loading}
        >
          💾 {loading ? 'Saving...' : 'Save Bank Details'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PatientBankSetup;