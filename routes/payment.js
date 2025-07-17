const express = require('express');
const router = express.Router();

// Process payment
router.post('/process', async (req, res) => {
  try {
    const { amount, patientId, doctorId, appointmentId } = req.body;
    
    // Calculate commission (12%)
    const platformCommission = amount * 0.12;
    const doctorEarnings = amount - platformCommission;
    
    // Simulate payment processing
    const paymentResult = {
      success: true,
      transactionId: `TXN_${Date.now()}`,
      amount,
      platformCommission,
      doctorEarnings,
      status: 'completed',
      timestamp: new Date()
    };
    
    console.log('Payment processed:', paymentResult);
    
    res.json({
      success: true,
      message: 'Payment processed successfully',
      transaction: paymentResult
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Payment processing failed',
      error: error.message 
    });
  }
});

// Get payment history
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Mock payment history
    const payments = [
      {
        id: 1,
        amount: 500,
        doctorName: 'Dr. Sharma',
        date: new Date(),
        status: 'completed',
        transactionId: 'TXN_123456'
      }
    ];
    
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;