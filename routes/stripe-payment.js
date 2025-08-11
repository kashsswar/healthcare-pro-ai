const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'inr', doctorId, patientId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to paise
      currency,
      metadata: {
        doctorId,
        patientId
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Confirm payment
router.post('/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      // Payment successful - create appointment
      res.json({ success: true, paymentIntent });
    } else {
      res.json({ success: false, status: paymentIntent.status });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;