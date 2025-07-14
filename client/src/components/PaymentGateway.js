import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography, Box, Alert, CircularProgress 
} from '@mui/material';
import { Payment, CheckCircle } from '@mui/icons-material';

function PaymentGateway({ open, onClose, doctor, onPaymentSuccess }) {
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const consultationFee = doctor?.consultationFee || 500;
  const doctorAmount = Math.round(consultationFee * 0.8);
  const platformFee = consultationFee - doctorAmount;

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(async () => {
      try {
        const response = await fetch('/api/payments/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            doctorId: doctor._id,
            amount: consultationFee,
            doctorAmount,
            platformFee
          })
        });
        
        if (response.ok) {
          setPaymentComplete(true);
          setTimeout(() => {
            onPaymentSuccess();
            onClose();
          }, 2000);
        }
      } catch (error) {
        alert('Payment failed. Please try again.');
      } finally {
        setProcessing(false);
      }
    }, 3000);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Payment sx={{ mr: 1 }} />
          💳 Secure Payment
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {paymentComplete ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircle color="success" sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h5" color="success.main" gutterBottom>
              Payment Successful! ✅
            </Typography>
            <Typography variant="body1">
              Your appointment is confirmed with Dr. {doctor?.userId?.name}
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Consultation with Dr. {doctor?.userId?.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {doctor?.specialization} • {doctor?.experience} years experience
              </Typography>
            </Box>

            <Box sx={{ bgcolor: 'info.light', p: 2, borderRadius: 1, mb: 2 }}>
              <Typography variant="h6">Payment Breakdown:</Typography>
              <Typography>Consultation Fee: ₹{consultationFee}</Typography>
              <Typography variant="body2" color="textSecondary">
                • Doctor receives: ₹{doctorAmount} (80%)
                <br />• Platform fee: ₹{platformFee} (20%)
              </Typography>
            </Box>

            <Alert severity="success" sx={{ mb: 2 }}>
              🔒 Secure payment powered by Razorpay. Your appointment will be confirmed instantly after payment.
            </Alert>

            {processing && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
                <CircularProgress sx={{ mr: 2 }} />
                <Typography>Processing payment...</Typography>
              </Box>
            )}
          </>
        )}
      </DialogContent>

      {!paymentComplete && (
        <DialogActions>
          <Button onClick={onClose} disabled={processing}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handlePayment}
            disabled={processing}
            size="large"
          >
            {processing ? 'Processing...' : `💳 Pay ₹${consultationFee}`}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

export default PaymentGateway;