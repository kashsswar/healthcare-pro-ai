import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Chip, Box } from '@mui/material';
import { Payment, Receipt } from '@mui/icons-material';

function PatientPaymentHistory({ user }) {
  const [payments, setPayments] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    loadPaymentHistory();
  }, [user]);

  const loadPaymentHistory = () => {
    const bookedAppointments = JSON.parse(localStorage.getItem('bookedAppointments') || '[]');
    const userAppointments = bookedAppointments.filter(apt => 
      apt.patient?.email === user.email || 
      apt.patientId === user.id || 
      apt.patientId === user._id
    );

    let total = 0;
    const paymentList = userAppointments
      .filter(apt => apt.paymentStatus === 'paid')
      .map(apt => {
        const amount = apt.consultationFee || 500;
        total += amount;
        return {
          id: apt._id,
          doctorName: apt.doctorName || apt.doctor?.name || 'Doctor',
          date: new Date(apt.scheduledTime).toLocaleDateString(),
          amount: amount,
          status: apt.status,
          paymentId: apt.paymentId
        };
      });

    setPayments(paymentList);
    setTotalSpent(total);
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <Payment sx={{ mr: 1, verticalAlign: 'middle' }} />
          Payment History
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" color="primary.main">₹{totalSpent}</Typography>
          <Typography variant="body2">Total Spent on Healthcare</Typography>
        </Box>

        <Typography variant="h6" gutterBottom>Recent Payments</Typography>
        <List>
          {payments.slice(0, 5).map((payment) => (
            <ListItem key={payment.id} divider>
              <ListItemText
                primary={`Dr. ${payment.doctorName} - ₹${payment.amount}`}
                secondary={`${payment.date} | Payment ID: ${payment.paymentId}`}
              />
              <Chip 
                label={payment.status} 
                color={payment.status === 'completed' ? 'success' : 'primary'}
                size="small"
              />
            </ListItem>
          ))}
        </List>
        
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          <Receipt sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
          All payments are processed securely through Razorpay
        </Typography>
      </CardContent>
    </Card>
  );
}

export default PatientPaymentHistory;