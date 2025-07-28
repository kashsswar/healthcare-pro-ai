require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Doctor = require('./models/Doctor');

const realDoctors = [
  // Database cleared - ready for manual doctor addition
];

async function addRealDoctors() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🏥 Adding real doctors...');
    
    for (const doctorData of realDoctors) {
      // Check if doctor already exists
      const existingUser = await User.findOne({ email: doctorData.email });
      if (existingUser) {
        console.log(`⚠️  Doctor ${doctorData.name} already exists, skipping...`);
        continue;
      }

      // Create user account
      const hashedPassword = await bcrypt.hash('doctor123', 10);
      const user = new User({
        name: doctorData.name,
        email: doctorData.email,
        password: hashedPassword,
        phone: doctorData.phone,
        role: 'doctor'
      });
      await user.save();

      // Create doctor profile
      const doctor = new Doctor({
        userId: user._id,
        specialization: doctorData.specialization,
        experience: doctorData.experience,
        consultationFee: doctorData.consultationFee,
        qualification: doctorData.qualification,
        location: doctorData.location,
        about: doctorData.about,
        rating: Math.random() * 1.5 + 3.5, // Random rating between 3.5-5.0
        totalRatings: Math.floor(Math.random() * 200) + 50,
        availability: {
          isAvailable: Math.random() > 0.3, // 70% chance of being available
          schedule: {
            monday: { isAvailable: true, slots: ['09:00-17:00'] },
            tuesday: { isAvailable: true, slots: ['09:00-17:00'] },
            wednesday: { isAvailable: true, slots: ['09:00-17:00'] },
            thursday: { isAvailable: true, slots: ['09:00-17:00'] },
            friday: { isAvailable: true, slots: ['09:00-17:00'] },
            saturday: { isAvailable: true, slots: ['09:00-13:00'] },
            sunday: { isAvailable: false, slots: [] }
          }
        },
        isVerified: true,
        isFeatured: Math.random() > 0.7, // 30% chance of being featured
        adminBoostRating: 0
      });
      await doctor.save();

      console.log(`✅ Added Dr. ${doctorData.name} - ${doctorData.specialization}`);
    }

    console.log(`🎉 Successfully added ${realDoctors.length} real doctors!`);
    console.log('📋 All doctors have default password: doctor123');
    
  } catch (error) {
    console.error('❌ Error adding doctors:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
addRealDoctors();
