const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  balance: { type: Number, default: 0 },
  transactions: [{
    type: { type: String, enum: ['credit', 'debit'], required: true },
    amount: { type: Number, required: true },
    description: String,
    transactionId: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const Wallet = mongoose.model('PatientWallet', walletSchema);

// Get wallet balance
router.get('/:userId', async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ userId: req.params.userId });
    if (!wallet) {
      wallet = new Wallet({ userId: req.params.userId, balance: 0 });
      await wallet.save();
    }
    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add money to wallet (refunds)
router.post('/credit', async (req, res) => {
  try {
    const { userId, amount, description, transactionId } = req.body;
    
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = new Wallet({ userId, balance: 0 });
    }
    
    wallet.balance += amount;
    wallet.transactions.push({
      type: 'credit',
      amount,
      description: description || 'Refund',
      transactionId,
      timestamp: new Date()
    });
    
    await wallet.save();
    res.json({ success: true, wallet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Withdraw money from wallet
router.post('/withdraw', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    
    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    
    // Check if bank details exist
    const BankDetails = mongoose.model('BankDetails');
    const bankDetails = await BankDetails.findOne({ userId, userType: 'patient' });
    if (!bankDetails) {
      return res.status(400).json({ message: 'Bank details not found. Please setup your bank account first.' });
    }
    
    wallet.balance -= amount;
    wallet.transactions.push({
      type: 'debit',
      amount,
      description: `Withdrawal to ${bankDetails.bankName} (${bankDetails.accountNumber.slice(-4)})`,
      transactionId: `WD_${Date.now()}`,
      timestamp: new Date()
    });
    
    await wallet.save();
    
    res.json({ 
      success: true, 
      message: `₹${amount} withdrawn to your ${bankDetails.bankName} account`,
      wallet 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;