import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Box, List, ListItem, ListItemText, Chip } from '@mui/material';
import { AccountBalance, TrendingUp } from '@mui/icons-material';

function DoctorPayouts({ user }) {
  const [payouts, setPayouts] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);

  useEffect(() => {
    loadPayoutData();
  }, [user]);

  const loadPayoutData = () => {
    const bookedAppointments = JSON.parse(localStorage.getItem('bookedAppointments') || '[]');
    const doctorId = user._id || user.id;
    
    const doctorAppointments = bookedAppointments.filter(apt => 
      (apt.doctorId === doctorId || apt.doctor === doctorId) && 
      apt.status === 'completed' && 
      apt.paymentStatus === 'paid'
    );

    let total = 0;
    let pending = 0;
    const payoutList = [];

    doctorAppointments.forEach(apt => {
      const fee = apt.consultationFee || 500;
      const doctorShare = Math.round(fee * 0.88); // 88% to doctor, 12% platform fee
      total += doctorShare;
      
      if (!apt.payoutProcessed) {
        pending += doctorShare;
      }

      payoutList.push({
        id: apt._id,
        patientName: apt.patient?.name || 'Patient',
        date: new Date(apt.scheduledTime).toLocaleDateString(),
        amount: doctorShare,
        status: apt.payoutProcessed ? 'Paid' : 'Pending',
        paymentId: apt.paymentId
      });
    });

    setPayouts(payoutList);
    setTotalEarnings(total);
    setPendingAmount(pending);
  };

  const requestPayout = async () => {
    try {
      // Simulate payout processing
      alert(`Payout request of ₹${pendingAmount} submitted. Amount will be transferred to your bank account within 24 hours.`);
      
      // Mark payouts as processed
      const bookedAppointments = JSON.parse(localStorage.getItem('bookedAppointments') || '[]');
      const updatedAppointments = bookedAppointments.map(apt => {
        if ((apt.doctorId === user._id || apt.doctor === user._id) && 
            apt.status === 'completed' && 
            !apt.payoutProcessed) {
          return { ...apt, payoutProcessed: true, payoutDate: new Date().toISOString() };
        }
        return apt;
      });
      
      localStorage.setItem('bookedAppointments', JSON.stringify(updatedAppointments));
      loadPayoutData();
    } catch (error) {
      alert('Payout request failed. Please try again.');
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <AccountBalance sx={{ mr: 1, verticalAlign: 'middle' }} />
          Earnings & Payouts
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
          <Box>
            <Typography variant="h4" color="success.main">₹{totalEarnings}</Typography>
            <Typography variant="body2">Total Earnings</Typography>
          </Box>
          <Box>
            <Typography variant="h4" color="warning.main">₹{pendingAmount}</Typography>
            <Typography variant="body2">Pending Payout</Typography>
          </Box>
        </Box>

        {pendingAmount > 0 && (
          <Button 
            variant="contained" 
            startIcon={<TrendingUp />}
            onClick={requestPayout}
            sx={{ mb: 2 }}
          >
            Request Payout (₹{pendingAmount})
          </Button>
        )}

        <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
        <List>
          {payouts.slice(0, 5).map((payout) => (
            <ListItem key={payout.id} divider>
              <ListItemText
                primary={`${payout.patientName} - ₹${payout.amount}`}
                secondary={`${payout.date} | Payment ID: ${payout.paymentId}`}
              />
              <Chip 
                label={payout.status} 
                color={payout.status === 'Paid' ? 'success' : 'warning'}
                size="small"
              />
            </ListItem>
          ))}
        </List>
        
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          * You receive 88% of consultation fee. 12% platform fee covers payment processing, app maintenance, and marketing.
        </Typography>
      </CardContent>
    </Card>
  );
}

export default DoctorPayouts;