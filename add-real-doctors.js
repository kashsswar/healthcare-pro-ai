require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Doctor = require('./models/Doctor');

const realDoctors = [
  {
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@healthpro.com",
    phone: "+91-9876543210",
    specialization: "Cardiology",
    experience: 15,
    consultationFee: 800,
    qualification: ["MBBS", "MD Cardiology", "DM Interventional Cardiology"],
    location: { city: "Mumbai", state: "Maharashtra" },
    about: "Senior Cardiologist with 15+ years experience in interventional cardiology and heart surgeries."
  },
  {
    name: "Dr. Priya Sharma",
    email: "priya.sharma@healthpro.com", 
    phone: "+91-9876543211",
    specialization: "Dermatology",
    experience: 12,
    consultationFee: 600,
    qualification: ["MBBS", "MD Dermatology", "Fellowship in Cosmetic Dermatology"],
    location: { city: "Delhi", state: "Delhi" },
    about: "Expert dermatologist specializing in skin disorders, cosmetic treatments, and hair care."
  },
  {
    name: "Dr. Amit Patel",
    email: "amit.patel@healthpro.com",
    phone: "+91-9876543212", 
    specialization: "Orthopedic Surgery",
    experience: 18,
    consultationFee: 900,
    qualification: ["MBBS", "MS Orthopedics", "Fellowship in Joint Replacement"],
    location: { city: "Ahmedabad", state: "Gujarat" },
    about: "Orthopedic surgeon with expertise in joint replacement, sports injuries, and spine surgery."
  },
  {
    name: "Dr. Kavya Reddy",
    email: "kavya.reddy@healthpro.com",
    phone: "+91-9876543213",
    specialization: "Pediatrics", 
    experience: 10,
    consultationFee: 500,
    qualification: ["MBBS", "MD Pediatrics", "Fellowship in Neonatology"],
    location: { city: "Hyderabad", state: "Telangana" },
    about: "Pediatrician and neonatologist with special focus on child development and newborn care."
  },
  {
    name: "Dr. Suresh Gupta",
    email: "suresh.gupta@healthpro.com",
    phone: "+91-9876543214",
    specialization: "General Medicine",
    experience: 20,
    consultationFee: 400,
    qualification: ["MBBS", "MD Internal Medicine", "Diploma in Diabetology"],
    location: { city: "Pune", state: "Maharashtra" },
    about: "General physician with 20 years experience in treating diabetes, hypertension, and lifestyle diseases."
  },
  {
    name: "Dr. Meera Iyer",
    email: "meera.iyer@healthpro.com",
    phone: "+91-9876543215",
    specialization: "Gynecology",
    experience: 14,
    consultationFee: 700,
    qualification: ["MBBS", "MS Gynecology", "Fellowship in Laparoscopic Surgery"],
    location: { city: "Bangalore", state: "Karnataka" },
    about: "Gynecologist and obstetrician specializing in high-risk pregnancies and minimally invasive surgery."
  },
  {
    name: "Dr. Arjun Singh",
    email: "arjun.singh@healthpro.com",
    phone: "+91-9876543216",
    specialization: "Neurology",
    experience: 16,
    consultationFee: 1000,
    qualification: ["MBBS", "MD Neurology", "DM Neurology"],
    location: { city: "Chennai", state: "Tamil Nadu" },
    about: "Neurologist with expertise in stroke management, epilepsy treatment, and movement disorders."
  },
  {
    name: "Dr. Anita Joshi",
    email: "anita.joshi@healthpro.com",
    phone: "+91-9876543217",
    specialization: "Ophthalmology",
    experience: 11,
    consultationFee: 550,
    qualification: ["MBBS", "MS Ophthalmology", "Fellowship in Retinal Surgery"],
    location: { city: "Jaipur", state: "Rajasthan" },
    about: "Eye specialist with focus on retinal diseases, cataract surgery, and diabetic eye care."
  },
  {
    name: "Dr. Vikram Malhotra",
    email: "vikram.malhotra@healthpro.com",
    phone: "+91-9876543218",
    specialization: "ENT",
    experience: 13,
    consultationFee: 600,
    qualification: ["MBBS", "MS ENT", "Fellowship in Head & Neck Surgery"],
    location: { city: "Chandigarh", state: "Punjab" },
    about: "ENT surgeon specializing in sinus surgery, hearing disorders, and head & neck cancers."
  },
  {
    name: "Dr. Deepika Nair",
    email: "deepika.nair@healthpro.com",
    phone: "+91-9876543219",
    specialization: "Psychiatry",
    experience: 9,
    consultationFee: 800,
    qualification: ["MBBS", "MD Psychiatry", "Diploma in Clinical Psychology"],
    location: { city: "Kochi", state: "Kerala" },
    about: "Psychiatrist with expertise in anxiety disorders, depression, and addiction treatment."
  },
  {
    name: "Dr. Rohit Agarwal",
    email: "rohit.agarwal@healthpro.com",
    phone: "+91-9876543220",
    specialization: "Dentistry",
    experience: 8,
    consultationFee: 350,
    qualification: ["BDS", "MDS Oral Surgery", "Implantology Certification"],
    location: { city: "Lucknow", state: "Uttar Pradesh" },
    about: "Dental surgeon specializing in oral surgery, dental implants, and cosmetic dentistry."
  },
  {
    name: "Dr. Sanjay Verma",
    email: "sanjay.verma@healthpro.com",
    phone: "+91-9876543221",
    specialization: "Urology",
    experience: 17,
    consultationFee: 750,
    qualification: ["MBBS", "MS Urology", "MCh Urology"],
    location: { city: "Indore", state: "Madhya Pradesh" },
    about: "Urologist with expertise in kidney stone treatment, prostate surgery, and male infertility."
  }
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