require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Doctor = require('./models/Doctor');

const realDoctors = [
  {
    name: "Dr. Mahima Sinsinwar",
    email: "mahima.sinsinwar@healthpro.com",
    phone: "+91-9876543210",
    specialization: "General Medicine",
    experience: 8,
    consultationFee: 500,
    qualification: ["MBBS", "MD Internal Medicine"],
    location: { city: "Bharatpur", state: "Rajasthan" },
    about: "General physician with expertise in treating common health conditions and preventive care."
  },
  {
    name: "Dr. Rubina",
    email: "rubina@healthpro.com", 
    phone: "+91-9876543211",
    specialization: "Gynecology",
    experience: 10,
    consultationFee: 600,
    qualification: ["MBBS", "MS Gynecology"],
    location: { city: "Bharatpur", state: "Rajasthan" },
    about: "Gynecologist specializing in women's health, pregnancy care, and reproductive health."
  }
];

async function updateDoctors() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Remove all existing doctors
    console.log('🗑️ Removing all existing doctors...');
    const existingDoctors = await Doctor.find().populate('userId');
    for (const doctor of existingDoctors) {
      if (doctor.userId) {
        await User.findByIdAndDelete(doctor.userId._id);
      }
      await Doctor.findByIdAndDelete(doctor._id);
    }
    console.log('✅ Removed all existing doctors');

    console.log('🏥 Adding real doctors...');
    
    for (const doctorData of realDoctors) {
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
        rating: 4.5,
        totalRatings: 25,
        availability: {
          isAvailable: true,
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
        isFeatured: true,
        adminBoostRating: 0
      });
      await doctor.save();

      console.log(`✅ Added ${doctorData.name} - ${doctorData.specialization}`);
    }

    console.log(`🎉 Successfully updated doctors! Now only ${realDoctors.length} real doctors remain.`);
    console.log('📋 All doctors have password: doctor123');
    
  } catch (error) {
    console.error('❌ Error updating doctors:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
updateDoctors();
