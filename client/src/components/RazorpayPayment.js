import React from 'react';

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const RazorpayPayment = async ({ amount, doctorName, patientName, onSuccess, onFailure }) => {
  const res = await loadRazorpay();
  
  if (!res) {
    alert('Razorpay SDK failed to load');
    return;
  }

  const options = {
    key: process.env.REACT_APP_RAZORPAY_KEY_ID,
    amount: amount * 100, // Amount in paise
    currency: 'INR',
    name: 'Healthcare Platform',
    description: `Consultation with ${doctorName}`,
    handler: function (response) {
      onSuccess({
        paymentId: response.razorpay_payment_id,
        amount: amount,
        status: 'success'
      });
    },
    prefill: {
      name: patientName,
      email: '',
      contact: ''
    },
    theme: {
      color: '#2196f3'
    },
    modal: {
      ondismiss: function() {
        onFailure('Payment cancelled');
      }
    }
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};

export default RazorpayPayment;