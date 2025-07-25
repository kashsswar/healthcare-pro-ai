require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Doctor = require('./models/Doctor');

async function clearAllDoctors() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🗑️ Removing all doctors...');
    
    // Find all doctors and their associated users
    const doctors = await Doctor.find().populate('userId');
    
    for (const doctor of doctors) {
      if (doctor.userId) {
        await User.findByIdAndDelete(doctor.userId._id);
        console.log(`🗑️ Deleted user: ${doctor.userId.name}`);
      }
      await Doctor.findByIdAndDelete(doctor._id);
    }

    console.log('✅ All mock doctors removed from database');
    console.log('📝 Database is now ready for manual doctor addition');
    
  } catch (error) {
    console.error('❌ Error clearing doctors:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

clearAllDoctors();