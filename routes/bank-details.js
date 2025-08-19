const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const bankDetailsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Mixed, required: true },
  userType: { type: String, enum: ['doctor', 'patient'], required: true },
  accountNumber: { type: String, required: true },
  ifscCode: { type: String, required: true },
  bankName: { type: String, required: true },
  accountHolderName: { type: String, required: true }
}, { timestamps: true });

const BankDetails = mongoose.model('BankDetails', bankDetailsSchema);

// Save bank details
router.post('/', async (req, res) => {
  try {
    const { userId, userType, accountNumber, ifscCode, bankName, accountHolderName } = req.body;
    
    // Convert userId to ObjectId if it's a valid format, otherwise use as string
    let searchUserId = userId;
    if (mongoose.Types.ObjectId.isValid(userId)) {
      searchUserId = new mongoose.Types.ObjectId(userId);
    }
    
    const bankDetails = await BankDetails.findOneAndUpdate(
      { userId: searchUserId, userType },
      { accountNumber, ifscCode, bankName, accountHolderName },
      { upsert: true, new: true }
    );
    
    res.json(bankDetails);
  } catch (error) {
    console.error('Save bank details error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get bank details
router.get('/:userType/:userId', async (req, res) => {
  try {
    const { userId, userType } = req.params;
    
    let searchUserId = userId;
    if (mongoose.Types.ObjectId.isValid(userId)) {
      searchUserId = new mongoose.Types.ObjectId(userId);
    }
    
    const bankDetails = await BankDetails.findOne({
      userId: searchUserId,
      userType: userType
    });
    
    res.json(bankDetails || {});
  } catch (error) {
    console.error('Bank details error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;