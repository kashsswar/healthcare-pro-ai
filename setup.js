require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
// Skip SpecializationService for setup to avoid OpenAI dependency

// Sample data setup
async function setupDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/doctor-commerce';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    console.log(`📍 Database: ${mongoUri.includes('mongodb.net') ? 'Cloud (Atlas)' : 'Local'}`);

    // Create diverse sample doctors with various specializations
    const sampleDoctors = [
      {
        name: 'Dr. Sarah Johnson', email: 'sarah.johnson@healthconnect.com', password: 'password123', phone: '+1234567890', role: 'doctor',
        doctorInfo: { specialization: 'General Medicine', qualification: ['MBBS', 'MD'], experience: 8, consultationFee: 500, city: 'Mumbai', isFeatured: true }
      },
      {
        name: 'Dr. Michael Chen', email: 'michael.chen@healthconnect.com', password: 'password123', phone: '+1234567891', role: 'doctor',
        doctorInfo: { specialization: 'Dentistry', qualification: ['BDS', 'MDS'], experience: 12, consultationFee: 800, city: 'Delhi', visibilityBoost: 2 }
      },
      {
        name: 'Dr. Priya Sharma', email: 'priya.sharma@healthconnect.com', password: 'password123', phone: '+1234567892', role: 'doctor',
        doctorInfo: { specialization: 'Cardiology', qualification: ['MBBS', 'MD', 'DM'], experience: 15, consultationFee: 1200, city: 'Bangalore' }
      },
      {
        name: 'Dr. Rajesh Kumar', email: 'rajesh.kumar@healthconnect.com', password: 'password123', phone: '+1234567893', role: 'doctor',
        doctorInfo: { specialization: 'Orthopedic Surgery', qualification: ['MBBS', 'MS'], experience: 10, consultationFee: 1000, city: 'Chennai' }
      },
      {
        name: 'Dr. Anita Desai', email: 'anita.desai@healthconnect.com', password: 'password123', phone: '+1234567894', role: 'doctor',
        doctorInfo: { specialization: 'Pediatrics', qualification: ['MBBS', 'MD'], experience: 7, consultationFee: 600, city: 'Pune', isFeatured: true }
      },
      {
        name: 'Dr. Vikram Singh', email: 'vikram.singh@healthconnect.com', password: 'password123', phone: '+1234567895', role: 'doctor',
        doctorInfo: { specialization: 'Dermatology', qualification: ['MBBS', 'MD'], experience: 9, consultationFee: 700, city: 'Hyderabad' }
      },
      {
        name: 'Dr. Meera Patel', email: 'meera.patel@healthconnect.com', password: 'password123', phone: '+1234567896', role: 'doctor',
        doctorInfo: { specialization: 'Gynecology', qualification: ['MBBS', 'MS'], experience: 11, consultationFee: 900, city: 'Ahmedabad' }
      },
      {
        name: 'Dr. Arjun Reddy', email: 'arjun.reddy@healthconnect.com', password: 'password123', phone: '+1234567897', role: 'doctor',
        doctorInfo: { specialization: 'Neurology', qualification: ['MBBS', 'MD', 'DM'], experience: 13, consultationFee: 1500, city: 'Kolkata', adminBoostRating: 0.5 }
      },
      {
        name: 'Dr. Kavya Nair', email: 'kavya.nair@healthconnect.com', password: 'password123', phone: '+1234567898', role: 'doctor',
        doctorInfo: { specialization: 'Ophthalmology', qualification: ['MBBS', 'MS'], experience: 6, consultationFee: 650, city: 'Kochi' }
      },
      {
        name: 'Dr. Suresh Gupta', email: 'suresh.gupta@healthconnect.com', password: 'password123', phone: '+1234567899', role: 'doctor',
        doctorInfo: { specialization: 'ENT (Ear, Nose, Throat)', qualification: ['MBBS', 'MS'], experience: 14, consultationFee: 850, city: 'Jaipur' }
      }
    ];

    for (const doctorData of sampleDoctors) {
      const existingUser = await User.findOne({ email: doctorData.email });
      if (!existingUser) {
        const user = new User({
          name: doctorData.name,
          email: doctorData.email,
          password: doctorData.password,
          phone: doctorData.phone,
          role: doctorData.role
        });
        await user.save();

        const doctor = new Doctor({
          userId: user._id,
          specialization: doctorData.doctorInfo.specialization,
          qualification: doctorData.doctorInfo.qualification,
          experience: doctorData.doctorInfo.experience,
          consultationFee: doctorData.doctorInfo.consultationFee,
          rating: Math.random() * 2 + 3.5, // Random rating between 3.5-5.5
          isFeatured: doctorData.doctorInfo.isFeatured || false,
          visibilityBoost: doctorData.doctorInfo.visibilityBoost || 0,
          adminBoostRating: doctorData.doctorInfo.adminBoostRating || 0,
          finalRating: (Math.random() * 2 + 3.5) + (doctorData.doctorInfo.adminBoostRating || 0),
          availability: [
            { day: 'Monday', startTime: '09:00', endTime: '17:00', isAvailable: true },
            { day: 'Tuesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
            { day: 'Wednesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
            { day: 'Thursday', startTime: '09:00', endTime: '17:00', isAvailable: true },
            { day: 'Friday', startTime: '09:00', endTime: '17:00', isAvailable: true },
            { day: 'Saturday', startTime: '10:00', endTime: '14:00', isAvailable: Math.random() > 0.5 }
          ],
          location: { 
            address: `${Math.floor(Math.random() * 999) + 1} Medical St`, 
            city: doctorData.doctorInfo.city,
            coordinates: { lat: Math.random() * 10 + 20, lng: Math.random() * 10 + 70 }
          },
          isVerified: true
        });
        await doctor.save();
        console.log(`✅ Created doctor: ${doctorData.name} (${doctorData.doctorInfo.specialization})`);
      }
    }

    // Create sample patient
    const patientExists = await User.findOne({ email: 'patient@test.com' });
    if (!patientExists) {
      const patient = new User({
        name: 'John Doe',
        email: 'patient@test.com',
        password: 'password123',
        phone: '+1234567892',
        role: 'patient',
        profile: {
          age: 30,
          gender: 'Male',
          address: '789 Patient St, Mumbai',
          medicalHistory: ['Hypertension'],
          allergies: ['Penicillin']
        }
      });
      await patient.save();
      console.log('✅ Created sample patient');
    }

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@healthcare.com' });
    if (!adminExists) {
      const admin = new User({
        name: 'Healthcare Admin',
        email: 'admin@healthcare.com',
        password: 'admin123',
        phone: '+1234567800',
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Created admin user');
    }

    console.log('\n🎉 Database setup completed!');
    console.log('📊 Sample data created:');
    console.log(`   • ${sampleDoctors.length} doctors across various specializations`);
    console.log('   • 1 sample patient account');
    console.log('   • Featured and boosted doctors for testing');
    console.log('\n🚀 Ready to start:');
    console.log('   Backend: npm run dev');
    console.log('   Frontend: cd client && npm start');
    process.exit(0);
  } catch (error) {
    console.error('Setup error:', error);
    process.exit(1);
  }
}

setupDatabase();
