const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const bankDetailsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
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
    
    const bankDetails = await BankDetails.findOneAndUpdate(
      { userId, userType },
      { accountNumber, ifscCode, bankName, accountHolderName },
      { upsert: true, new: true }
    );
    
    res.json(bankDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get bank details
router.get('/:userId/:userType', async (req, res) => {
  try {
    const bankDetails = await BankDetails.findOne({
      userId: req.params.userId,
      userType: req.params.userType
    });
    
    res.json(bankDetails || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;