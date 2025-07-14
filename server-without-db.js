const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// Middleware
app.use(cors());
app.use(express.json());

// Mock data for testing without MongoDB
const mockUsers = [
  { id: '1', name: 'John Doe', email: 'patient@test.com', password: 'password123', role: 'patient' },
  { id: '2', name: 'Dr. Sarah Johnson', email: 'doctor@test.com', password: 'password123', role: 'doctor' },
  { id: '3', name: 'Admin User', email: 'admin@test.com', password: 'admin123', role: 'admin' }
];

const mockDoctors = [
  // General Medicine
  {
    _id: '1',
    userId: { name: 'Dr. Sarah Johnson', email: 'sarah@test.com', phone: '+1234567890' },
    specialization: 'General Medicine',
    qualification: ['MBBS', 'MD'],
    experience: 8,
    rating: 4.5,
    finalRating: 4.8,
    adminBoostRating: 0.3,
    isFeatured: true,
    consultationFee: 500,
    location: { city: 'Mumbai' },
    isVerified: true,
    category: 'general',
    availability: {
      isAvailable: true,
      currentStatus: 'available',
      timings: { from: '9:00 AM', to: '6:00 PM' },
      nextAvailable: null
    }
  },
  {
    _id: '9',
    userId: { name: 'Dr. Ravi Kumar', email: 'ravi@test.com', phone: '+1234567899' },
    specialization: 'General Medicine',
    qualification: ['MBBS'],
    experience: 5,
    rating: 4.2,
    finalRating: 4.2,
    consultationFee: 400,
    location: { city: 'Delhi' },
    isVerified: true,
    category: 'general',
    availability: {
      isAvailable: false,
      currentStatus: 'not available',
      timings: null,
      nextAvailable: { from: '2:00 PM', to: '8:00 PM' }
    }
  },
  // Dentistry
  {
    _id: '2',
    userId: { name: 'Dr. Michael Chen', email: 'michael@test.com', phone: '+1234567891' },
    specialization: 'Dentistry',
    qualification: ['BDS', 'MDS'],
    experience: 12,
    rating: 4.2,
    finalRating: 4.7,
    adminBoostRating: 0.5,
    isFeatured: true,
    consultationFee: 800,
    location: { city: 'Delhi' },
    isVerified: true,
    category: 'dental',
    availability: {
      isAvailable: true,
      currentStatus: 'available',
      timings: { from: '10:00 AM', to: '7:00 PM' },
      nextAvailable: null
    }
  },
  {
    _id: '10',
    userId: { name: 'Dr. Kavita Sharma', email: 'kavita@test.com', phone: '+1234567810' },
    specialization: 'Dentistry',
    qualification: ['BDS'],
    experience: 6,
    rating: 4.0,
    finalRating: 4.0,
    consultationFee: 600,
    location: { city: 'Pune' },
    isVerified: true,
    category: 'dental',
    availability: {
      isAvailable: false,
      currentStatus: 'not available',
      timings: null,
      nextAvailable: { from: '11:00 AM', to: '5:00 PM' }
    }
  },
  // Cardiology
  {
    _id: '3',
    userId: { name: 'Dr. Priya Sharma', email: 'priya@test.com', phone: '+1234567892' },
    specialization: 'Cardiology',
    qualification: ['MBBS', 'MD Cardiology'],
    experience: 15,
    rating: 4.7,
    finalRating: 5.0,
    adminBoostRating: 0.3,
    isFeatured: true,
    consultationFee: 1200,
    location: { city: 'Mumbai' },
    isVerified: true,
    category: 'specialist',
    availability: {
      isAvailable: true,
      currentStatus: 'available',
      timings: { from: '8:00 AM', to: '4:00 PM' },
      nextAvailable: null
    }
  },
  {
    _id: '11',
    userId: { name: 'Dr. Suresh Reddy', email: 'suresh@test.com', phone: '+1234567811' },
    specialization: 'Cardiology',
    qualification: ['MBBS', 'DM Cardiology'],
    experience: 20,
    rating: 4.6,
    finalRating: 4.6,
    consultationFee: 1500,
    location: { city: 'Hyderabad' },
    isVerified: true,
    category: 'specialist',
    availability: {
      isAvailable: false,
      currentStatus: 'not available',
      timings: null,
      nextAvailable: { from: '6:00 PM', to: '9:00 PM' }
    }
  },
  {
    _id: '4',
    userId: { name: 'Dr. Rajesh Kumar', email: 'rajesh@test.com', phone: '+1234567893' },
    specialization: 'Pediatrics',
    qualification: ['MBBS', 'MD Pediatrics'],
    experience: 10,
    rating: 4.6,
    consultationFee: 700,
    location: { city: 'Pune' },
    isVerified: true,
    category: 'child'
  },
  {
    _id: '5',
    userId: { name: 'Dr. Anita Desai', email: 'anita@test.com', phone: '+1234567894' },
    specialization: 'Gynecology',
    qualification: ['MBBS', 'MS Gynecology'],
    experience: 14,
    rating: 4.8,
    consultationFee: 900,
    location: { city: 'Bangalore' },
    isVerified: true,
    category: 'women'
  },
  {
    _id: '6',
    userId: { name: 'Dr. Vikram Singh', email: 'vikram@test.com', phone: '+1234567895' },
    specialization: 'Orthopedics',
    qualification: ['MBBS', 'MS Orthopedics'],
    experience: 18,
    rating: 4.5,
    consultationFee: 1000,
    location: { city: 'Chennai' },
    isVerified: true,
    category: 'bones'
  },
  {
    _id: '7',
    userId: { name: 'Dr. Meera Patel', email: 'meera@test.com', phone: '+1234567896' },
    specialization: 'Dermatology',
    qualification: ['MBBS', 'MD Dermatology'],
    experience: 9,
    rating: 4.4,
    consultationFee: 800,
    location: { city: 'Ahmedabad' },
    isVerified: true,
    category: 'skin'
  },
  {
    _id: '8',
    userId: { name: 'Dr. Amit Gupta', email: 'amit@test.com', phone: '+1234567897' },
    specialization: 'Psychiatry',
    qualification: ['MBBS', 'MD Psychiatry'],
    experience: 11,
    rating: 4.3,
    consultationFee: 1100,
    location: { city: 'Hyderabad' },
    isVerified: true,
    category: 'mental'
  }
];

// Mock routes for testing
app.post('/api/auth/login', (req, res) => {
  console.log('🔐 Login attempt:', req.body);
  
  const { email, password } = req.body;
  
  if (!email || !password) {
    console.log('❌ Missing email or password');
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    console.log('✅ Login successful for:', email);
    res.json({
      token: 'mock-token-' + Date.now(),
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } else {
    console.log('❌ Login failed for:', email, '- Invalid credentials');
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role } = req.body;
  
  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  // Add new user to mock database
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password,
    role
  };
  mockUsers.push(newUser);
  
  res.status(201).json({
    token: 'mock-token',
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
  });
});

app.get('/api/doctors', (req, res) => {
  const { category, specialization } = req.query;
  
  let filtered = [...mockDoctors];
  
  if (category) {
    filtered = filtered.filter(doc => doc.category === category);
  }
  
  if (specialization) {
    filtered = filtered.filter(doc => doc.specialization.toLowerCase().includes(specialization.toLowerCase()));
  }
  
  // Sort by: Featured first, then by final rating, then by experience
  filtered.sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    if ((b.finalRating || b.rating) !== (a.finalRating || a.rating)) {
      return (b.finalRating || b.rating) - (a.finalRating || a.rating);
    }
    return b.experience - a.experience;
  });
  
  res.json(filtered);
});

// Get doctors by specialization
app.get('/api/doctors/by-specialization', (req, res) => {
  const specializations = {};
  
  mockDoctors.forEach(doctor => {
    if (!specializations[doctor.specialization]) {
      specializations[doctor.specialization] = [];
    }
    specializations[doctor.specialization].push(doctor);
  });
  
  // Sort doctors within each specialization
  Object.keys(specializations).forEach(spec => {
    specializations[spec].sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return (b.finalRating || b.rating) - (a.finalRating || a.rating);
    });
  });
  
  res.json(specializations);
});

app.get('/api/doctors/categories', (req, res) => {
  const categories = [
    { id: 'general', name: '🩺 General Medicine', icon: '🩺', count: mockDoctors.filter(d => d.category === 'general').length },
    { id: 'dental', name: '🦷 Dental Care', icon: '🦷', count: mockDoctors.filter(d => d.category === 'dental').length },
    { id: 'specialist', name: '❤️ Heart Specialist', icon: '❤️', count: mockDoctors.filter(d => d.category === 'specialist').length },
    { id: 'child', name: '👶 Child Doctor', icon: '👶', count: mockDoctors.filter(d => d.category === 'child').length },
    { id: 'women', name: '👩 Women Health', icon: '👩', count: mockDoctors.filter(d => d.category === 'women').length },
    { id: 'bones', name: '🦴 Bone Doctor', icon: '🦴', count: mockDoctors.filter(d => d.category === 'bones').length },
    { id: 'skin', name: '✨ Skin Doctor', icon: '✨', count: mockDoctors.filter(d => d.category === 'skin').length },
    { id: 'mental', name: '🧠 Mental Health', icon: '🧠', count: mockDoctors.filter(d => d.category === 'mental').length }
  ];
  
  res.json(categories);
});

app.get('/api/doctors/:id', (req, res) => {
  const doctor = mockDoctors.find(d => d._id === req.params.id);
  if (doctor) {
    res.json(doctor);
  } else {
    res.status(404).json({ message: 'Doctor not found' });
  }
});

app.post('/api/appointments/book', (req, res) => {
  const newAppointment = {
    _id: Date.now().toString(),
    patientId: req.body.patientId || Date.now().toString(),
    patientName: req.body.patientName || 'New Patient',
    doctorId: req.body.doctorId,
    symptoms: req.body.symptoms || ['consultation'],
    scheduledTime: new Date(req.body.preferredDate),
    status: 'scheduled',
    queuePosition: mockQueue.filter(a => a.doctorId === req.body.doctorId).length + 1,
    estimatedTime: `${(mockQueue.filter(a => a.doctorId === req.body.doctorId).length + 1) * 20} mins`,
    priority: 'medium',
    age: req.body.age || 30,
    phone: req.body.phone || '+91-9876543000'
  };
  
  mockQueue.push(newAppointment);
  
  res.status(201).json({
    appointment: newAppointment,
    message: 'Appointment booked successfully',
    aiInsights: {
      riskLevel: 'medium',
      suggestedDuration: 30,
      recommendations: ['Stay hydrated', 'Get adequate rest']
    }
  });
});

// Mock queue data
const mockQueue = [
  {
    _id: '1',
    patientId: '101',
    patientName: 'Rahul Sharma',
    doctorId: '1',
    symptoms: ['headache', 'fever', 'body ache'],
    scheduledTime: new Date(Date.now() + 30 * 60 * 1000), // 30 min from now
    status: 'waiting',
    queuePosition: 1,
    estimatedTime: '15 mins',
    priority: 'medium',
    age: 28,
    phone: '+91-9876543210'
  },
  {
    _id: '2',
    patientId: '102',
    patientName: 'Priya Patel',
    doctorId: '1',
    symptoms: ['tooth pain', 'swelling'],
    scheduledTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
    status: 'scheduled',
    queuePosition: 2,
    estimatedTime: '45 mins',
    priority: 'high',
    age: 35,
    phone: '+91-9876543211'
  },
  {
    _id: '3',
    patientId: '103',
    patientName: 'Amit Kumar',
    doctorId: '2',
    symptoms: ['chest pain', 'breathing difficulty'],
    scheduledTime: new Date(Date.now() + 15 * 60 * 1000), // 15 min from now
    status: 'in-consultation',
    queuePosition: 0,
    estimatedTime: 'In progress',
    priority: 'urgent',
    age: 45,
    phone: '+91-9876543212'
  },
  {
    _id: '4',
    patientId: '104',
    patientName: 'Sunita Devi',
    doctorId: '3',
    symptoms: ['stomach pain', 'nausea'],
    scheduledTime: new Date(Date.now() + 90 * 60 * 1000), // 1.5 hours from now
    status: 'scheduled',
    queuePosition: 1,
    estimatedTime: '1 hour 15 mins',
    priority: 'medium',
    age: 52,
    phone: '+91-9876543213'
  }
];

app.get('/api/appointments/patient/:patientId', (req, res) => {
  res.json([
    {
      _id: '1',
      doctor: mockDoctors[0],
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'scheduled',
      symptoms: ['headache', 'fever']
    }
  ]);
});

// Get doctor's queue
app.get('/api/appointments/doctor/:doctorId/queue', (req, res) => {
  const { doctorId } = req.params;
  let doctorQueue = mockQueue.filter(appointment => appointment.doctorId === doctorId);
  
  // If no queue for this doctor, create sample data
  if (doctorQueue.length === 0) {
    const sampleQueue = [
      {
        _id: 'q1',
        patientId: '201',
        patientName: 'Rajesh Gupta',
        doctorId: doctorId,
        symptoms: ['fever', 'cough', 'headache'],
        scheduledTime: new Date(Date.now() + 10 * 60 * 1000),
        status: 'waiting',
        queuePosition: 1,
        estimatedTime: '10 mins',
        priority: 'medium',
        age: 32,
        phone: '+91-9876543220'
      },
      {
        _id: 'q2',
        patientId: '202',
        patientName: 'Meera Singh',
        doctorId: doctorId,
        symptoms: ['stomach pain', 'nausea'],
        scheduledTime: new Date(Date.now() + 30 * 60 * 1000),
        status: 'scheduled',
        queuePosition: 2,
        estimatedTime: '30 mins',
        priority: 'high',
        age: 28,
        phone: '+91-9876543221'
      },
      {
        _id: 'q3',
        patientId: '203',
        patientName: 'Arjun Patel',
        doctorId: doctorId,
        symptoms: ['back pain', 'muscle strain'],
        scheduledTime: new Date(Date.now() + 50 * 60 * 1000),
        status: 'scheduled',
        queuePosition: 3,
        estimatedTime: '50 mins',
        priority: 'medium',
        age: 45,
        phone: '+91-9876543222'
      }
    ];
    
    // Add to global mock queue
    mockQueue.push(...sampleQueue);
    doctorQueue = sampleQueue;
  }
  
  res.json({
    queue: doctorQueue,
    totalPatients: doctorQueue.length,
    currentPatient: doctorQueue.find(p => p.status === 'in-consultation'),
    nextPatient: doctorQueue.find(p => p.status === 'waiting'),
    estimatedWaitTime: doctorQueue.reduce((total, p) => total + 20, 0)
  });
});

// Get all queues for admin
app.get('/api/appointments/all-queues', (req, res) => {
  const queuesByDoctor = {};
  
  mockQueue.forEach(appointment => {
    const doctor = mockDoctors.find(d => d._id === appointment.doctorId);
    if (!queuesByDoctor[appointment.doctorId]) {
      queuesByDoctor[appointment.doctorId] = {
        doctor: doctor,
        queue: [],
        totalPatients: 0
      };
    }
    queuesByDoctor[appointment.doctorId].queue.push(appointment);
    queuesByDoctor[appointment.doctorId].totalPatients++;
  });
  
  res.json(queuesByDoctor);
});

app.post('/api/ai/health-recommendations', (req, res) => {
  const aiRecommendations = [
    'AI Analysis: Maintain optimal oral pH levels through regular dental hygiene',
    'Clinical AI Insight: Hydration supports cellular regeneration and toxin elimination',
    'AI Health Protocol: 150 minutes weekly cardiovascular exercise for optimal heart function',
    'Predictive AI Model: 7-9 hours sleep optimizes immune system performance',
    'AI Nutritional Analysis: Antioxidant-rich foods reduce inflammatory markers',
    'AI Behavioral Study: Limit processed sugar intake to prevent metabolic dysfunction',
    'AI Preventive Care: Bi-annual dental screenings prevent 90% of oral complications',
    'AI Wellness Algorithm: Regular meditation reduces cortisol levels by 23%',
    'AI Ergonomic Analysis: 20-20-20 rule prevents digital eye strain syndrome',
    'AI Lifestyle Optimization: Social connections improve longevity by 15 years',
    'AI Metabolic Insights: Intermittent fasting enhances cellular autophagy',
    'AI Risk Assessment: Annual health screenings detect issues 5x earlier',
    'AI Respiratory Protocol: Deep breathing exercises improve oxygen efficiency',
    'AI Posture Analysis: Ergonomic workspace prevents musculoskeletal disorders',
    'AI Mental Health: Regular exercise releases endorphins, natural mood elevators'
  ];
  
  // AI-powered recommendation selection with timestamp
  const shuffled = aiRecommendations.sort(() => 0.5 - Math.random());
  const selectedRecommendations = shuffled.slice(0, 7);
  
  res.json({ 
    recommendations: selectedRecommendations,
    aiTimestamp: new Date().toISOString(),
    analysisVersion: 'HealthCare Pro AI v2.1',
    confidence: '94.7%'
  });
});

app.post('/api/ai/analyze-symptoms', (req, res) => {
  res.json({
    analysis: {
      riskLevel: 'medium',
      suggestedDuration: 30,
      recommendations: ['Stay hydrated', 'Monitor symptoms', 'Consult doctor if symptoms persist']
    }
  });
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.set('io', io);

app.post('/api/admin/share-doctor', (req, res) => {
  const { doctorId, shareType } = req.body;
  
  const doctor = mockDoctors.find(d => d._id === doctorId);
  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }

  switch (shareType) {
    case 'whatsapp':
      doctor.marketingReach.whatsappShares += 1;
      break;
    case 'referral':
      doctor.marketingReach.referrals += 1;
      break;
    case 'social':
      doctor.marketingReach.socialShares += 1;
      break;
  }

  res.json({ message: 'Share tracked successfully' });
});

app.post('/api/admin/boost-doctor', (req, res) => {
  const { doctorId, boostType, boostValue } = req.body;
  
  const doctor = mockDoctors.find(d => d._id === doctorId);
  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }

  switch (boostType) {
    case 'rating':
      doctor.adminBoostRating = boostValue;
      doctor.finalRating = Math.min(5, doctor.rating + doctor.adminBoostRating);
      doctor.isTopRated = true;
      break;
    case 'featured':
      doctor.isFeatured = true;
      doctor.featuredOrder = 1;
      break;
    case 'visibility':
      doctor.visibilityBoost = boostValue;
      doctor.searchPriority = 1;
      break;
  }

  // Sort doctors array to put boosted doctors on top
  mockDoctors.sort((a, b) => {
    if (a.isFirstPosition && !b.isFirstPosition) return -1;
    if (!a.isFirstPosition && b.isFirstPosition) return 1;
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    if (a.isTopRated && !b.isTopRated) return -1;
    if (!a.isTopRated && b.isTopRated) return 1;
    return (b.finalRating || b.rating) - (a.finalRating || a.rating);
  });

  res.json({ 
    message: 'Doctor boosted successfully - now appearing at top',
    doctor
  });
});

app.post('/api/admin/set-first-position', (req, res) => {
  const { doctorId, makeFirst } = req.body;
  
  const doctor = mockDoctors.find(d => d._id === doctorId);
  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }

  if (makeFirst) {
    // Remove first position from all other doctors
    mockDoctors.forEach(d => d.isFirstPosition = false);
    doctor.isFirstPosition = true;
  } else {
    doctor.isFirstPosition = false;
  }

  // Sort doctors array
  mockDoctors.sort((a, b) => {
    if (a.isFirstPosition && !b.isFirstPosition) return -1;
    if (!a.isFirstPosition && b.isFirstPosition) return 1;
    return (b.finalRating || b.rating) - (a.finalRating || a.rating);
  });

  res.json({ 
    message: makeFirst ? 'Doctor set to first position' : 'Doctor removed from first position'
  });
});

app.post('/api/doctors/availability', (req, res) => {
  const { doctorId, isOnline, location, availability } = req.body;
  
  const doctor = mockDoctors.find(d => d._id === doctorId);
  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }

  doctor.isOnline = isOnline;
  doctor.location = { city: location };
  doctor.availability = availability;

  res.json({ 
    message: 'Availability updated successfully',
    doctor
  });
});

app.post('/api/appointments/refer', (req, res) => {
  const { appointmentId, fromDoctorId, toDoctorId, reason, patientId } = req.body;
  
  const fromDoctor = mockDoctors.find(d => d._id === fromDoctorId);
  const toDoctor = mockDoctors.find(d => d._id === toDoctorId);
  const appointment = mockQueue.find(a => a._id === appointmentId);
  
  if (!fromDoctor || !toDoctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }
  
  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  // Update appointment to new doctor - NO ADDITIONAL CHARGE
  appointment.doctorId = toDoctorId;
  appointment.status = 'referred';
  appointment.referralReason = reason;
  appointment.originalDoctorId = fromDoctorId;
  appointment.referredAt = new Date();
  appointment.queuePosition = 1; // Priority for referred patients
  appointment.priority = 'referred'; // Special priority
  
  // Add to new doctor's queue at priority position
  const newQueueEntry = {
    ...appointment,
    _id: Date.now().toString(),
    status: 'waiting',
    estimatedTime: '10 mins', // Priority timing
    referralNote: `Referred from Dr. ${fromDoctor.userId.name} - ${reason}`
  };
  
  mockQueue.push(newQueueEntry);
  
  // Remove from original doctor's queue
  const originalIndex = mockQueue.findIndex(a => a._id === appointmentId);
  if (originalIndex > -1) {
    mockQueue[originalIndex].status = 'referred-out';
  }

  const referral = {
    _id: Date.now().toString(),
    appointmentId,
    fromDoctor: fromDoctor.userId.name,
    toDoctor: toDoctor.userId.name,
    reason,
    patientId,
    patientName: appointment.patientName,
    status: 'completed',
    noAdditionalCharge: true,
    createdAt: new Date(),
    newAppointmentId: newQueueEntry._id
  };
  
  res.json({ 
    message: 'Patient referred successfully - No additional charge',
    referral,
    newAppointment: newQueueEntry,
    notification: `✅ Patient ${appointment.patientName} referred to Dr. ${toDoctor.userId.name} for ${reason}. No additional charge applied.`,
    benefits: {
      patientBenefit: 'No extra payment required',
      doctorBenefit: 'Referral fee waived',
      priorityTreatment: 'Patient gets priority slot'
    }
  });
});

// Update appointment status
app.post('/api/appointments/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const appointment = mockQueue.find(a => a._id === id);
  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found' });
  }
  
  appointment.status = status;
  
  if (status === 'completed') {
    appointment.completedAt = new Date();
    // Move queue positions up
    mockQueue.forEach(a => {
      if (a.doctorId === appointment.doctorId && a.queuePosition > appointment.queuePosition) {
        a.queuePosition -= 1;
        a.estimatedTime = `${(a.queuePosition * 20)} mins`;
      }
    });
  }
  
  res.json({ 
    message: 'Appointment status updated',
    appointment
  });
});

// Payment APIs
app.post('/api/doctors/bank-details', (req, res) => {
  const { doctorId, accountNumber, ifscCode, bankName, accountHolderName } = req.body;
  
  // Save bank details (in real app, encrypt sensitive data)
  res.json({
    message: 'Bank details saved successfully',
    status: 'verified',
    paymentEnabled: true
  });
});

app.post('/api/payments/process', (req, res) => {
  const { doctorId, amount, doctorAmount, platformFee } = req.body;
  
  const paymentId = 'pay_' + Date.now();
  
  // Admin bank details (your account)
  const adminBankDetails = {
    accountNumber: 'ADMIN_ACC_2024',
    ifscCode: 'HDFC0001234',
    bankName: 'HDFC Bank',
    accountHolder: 'HealthCare Pro Admin'
  };
  
  // Process payment and transfers
  res.json({
    success: true,
    paymentId,
    doctorTransfer: {
      amount: doctorAmount,
      status: 'transferred',
      transferId: 'txn_doc_' + Date.now()
    },
    adminTransfer: {
      amount: platformFee,
      status: 'transferred',
      transferId: 'txn_admin_' + Date.now(),
      bankDetails: adminBankDetails
    },
    message: 'Payment processed - 80% to doctor, 20% to admin account'
  });
});

app.post('/api/patients/payment-method', (req, res) => {
  const { patientId, cardNumber, expiryDate, cvv, cardHolderName } = req.body;
  
  // Save encrypted payment method
  res.json({
    message: 'Payment method saved securely',
    status: 'verified',
    lastFourDigits: cardNumber.slice(-4)
  });
});

// Admin Analytics APIs
app.get('/api/admin/stats', (req, res) => {
  const today = new Date().toDateString();
  
  // Calculate admin earnings (20% of all consultations)
  const totalConsultationsToday = 45;
  const avgConsultationFee = 600;
  const totalRevenueToday = totalConsultationsToday * avgConsultationFee;
  const adminEarningsToday = Math.round(totalRevenueToday * 0.2);
  
  const monthlyConsultations = 1200;
  const adminMonthlyEarnings = Math.round(monthlyConsultations * avgConsultationFee * 0.2);
  
  const yearlyConsultations = 12000;
  const adminYearlyEarnings = Math.round(yearlyConsultations * avgConsultationFee * 0.2);
  
  res.json({
    newDoctorsToday: 3,
    newDoctorsWeek: 12,
    patientsToday: totalConsultationsToday,
    revenueToday: totalRevenueToday,
    adminEarningsToday,
    adminMonthlyEarnings,
    adminYearlyEarnings,
    monthlyRevenue: monthlyConsultations * avgConsultationFee,
    healthScore: 97,
    topDoctorMonth: { name: 'Sarah Johnson', patients: 89 },
    growthRate: 23,
    aiResolved: 18,
    threatsBlocked: 4,
    optimizations: 7
  });
});

app.get('/api/admin/security-alerts', (req, res) => {
  res.json([
    {
      id: '1',
      severity: 'error',
      message: '🚨 Multiple failed login attempts detected from IP 192.168.1.100',
      timestamp: new Date(Date.now() - 300000),
      aiSolution: 'IP blocked automatically, CAPTCHA enabled'
    },
    {
      id: '2', 
      severity: 'warning',
      message: '⚠️ Database response time increased by 15%',
      timestamp: new Date(Date.now() - 600000),
      aiSolution: 'Query optimization applied, indexing improved'
    }
  ]);
});

app.get('/api/admin/top-earners', (req, res) => {
  res.json({
    today: [
      { id: '1', name: 'Sarah Johnson', specialization: 'General Medicine', earnings: 8500, patients: 17 },
      { id: '2', name: 'Michael Chen', specialization: 'Dentistry', earnings: 7200, patients: 9 },
      { id: '3', name: 'Priya Sharma', specialization: 'Cardiology', earnings: 6800, patients: 8 }
    ],
    month: [
      { id: '1', name: 'Sarah Johnson', earnings: 125000, patients: 250 },
      { id: '2', name: 'Michael Chen', earnings: 98000, patients: 122 }
    ]
  });
});

app.post('/api/admin/resolve-alert/:id', (req, res) => {
  const { id } = req.params;
  res.json({ 
    message: 'Alert resolved by AI',
    action: 'Automated security patch applied',
    timestamp: new Date()
  });
});

// AI Analysis APIs
app.get('/api/ai/analysis', (req, res) => {
  res.json({
    analysis: {
      peakHours: '2-4 PM, 7-9 PM',
      topDemand: 'Dentistry (+45%), General Medicine (+32%)',
      growthRate: 28,
      userPattern: 'Rural users prefer voice search, Urban users use text',
      opportunity: 'Add more BDS doctors in Tier-2 cities for 40% revenue boost'
    },
    recommendations: [
      {
        title: 'Add WhatsApp booking for rural users',
        impact: '+25% bookings',
        confidence: 87,
        priority: 'High'
      },
      {
        title: 'Increase BDS doctor visibility in search',
        impact: '+18% dental appointments', 
        confidence: 92,
        priority: 'High'
      },
      {
        title: 'Send health tips via SMS to inactive users',
        impact: '+12% user retention',
        confidence: 78,
        priority: 'Medium'
      }
    ],
    pendingActions: [
      {
        id: '1',
        title: 'Auto-boost Dr. Michael Chen (BDS) rating by +0.3',
        description: 'Low dental bookings detected. Boosting top BDS doctor will increase visibility.',
        expectedImpact: '+15% dental appointments this week'
      },
      {
        id: '2', 
        title: 'Send targeted health alerts to 500+ inactive users',
        description: 'Users inactive for 30+ days. AI suggests personalized health reminders.',
        expectedImpact: '+8% user reactivation'
      },
      {
        id: '3',
        title: 'Add new specialization: Pediatrics',
        description: '23% of searches are for child doctors. High demand detected.',
        expectedImpact: '+30% new user acquisition'
      }
    ]
  });
});

app.post('/api/ai/approve-action/:id', (req, res) => {
  const { id } = req.params;
  
  // Simulate AI executing approved actions
  const actions = {
    '1': () => {
      // Boost doctor rating
      const doctor = mockDoctors.find(d => d.userId.name === 'Dr. Michael Chen');
      if (doctor) {
        doctor.adminBoostRating = 0.3;
        doctor.finalRating = doctor.rating + 0.3;
      }
      return 'BDS doctor rating boosted successfully';
    },
    '2': () => {
      // Send health alerts (simulate)
      return '500 personalized health alerts sent via SMS';
    },
    '3': () => {
      // Add new specialization
      return 'Pediatrics specialization added to platform';
    }
  };
  
  const result = actions[id] ? actions[id]() : 'Action executed';
  
  res.json({
    message: 'AI action approved and executed',
    result,
    timestamp: new Date()
  });
});

app.post('/api/ai/reject-action/:id', (req, res) => {
  res.json({
    message: 'AI action rejected',
    note: 'AI will learn from this decision',
    timestamp: new Date()
  });
});

// Auto-Marketing APIs
app.get('/api/marketing/auto-campaigns', (req, res) => {
  res.json({
    campaigns: [
      {
        id: '1',
        name: 'WhatsApp Health Tips Broadcast',
        description: 'Daily health tips sent to 1000+ contacts with app download links',
        status: 'active',
        currentReach: 850,
        targetReach: 1000,
        roi: 340
      },
      {
        id: '2',
        name: 'Doctor Success Story Sharing',
        description: 'Auto-post doctor testimonials in medical WhatsApp groups',
        status: 'active',
        currentReach: 45,
        targetReach: 100,
        roi: 280
      },
      {
        id: '3',
        name: 'Patient Referral Rewards',
        description: 'Automated ₹100 rewards for successful patient referrals',
        status: 'active',
        currentReach: 234,
        targetReach: 500,
        roi: 450
      },
      {
        id: '4',
        name: 'Medical College Outreach',
        description: 'Target fresh medical graduates with platform benefits',
        status: 'ready',
        currentReach: 0,
        targetReach: 200,
        roi: 0
      }
    ],
    stats: {
      totalReach: 2340,
      whatsappReach: 1200,
      socialReach: 680,
      referralReach: 460,
      newUsers: 89
    }
  });
});

app.post('/api/marketing/launch/:id', (req, res) => {
  const { id } = req.params;
  
  const campaigns = {
    '4': () => {
      // Launch medical college campaign
      return 'Medical college outreach campaign launched - targeting 200 fresh graduates';
    }
  };
  
  const result = campaigns[id] ? campaigns[id]() : 'Campaign launched successfully';
  
  res.json({
    message: 'Marketing campaign launched',
    result,
    timestamp: new Date()
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Mock server running on port ${PORT}`);
  console.log('🌐 Backend API: http://localhost:' + PORT);
  console.log('📝 Test credentials:');
  console.log('   Patient: patient@test.com / password123');
  console.log('   Doctor: doctor@test.com / password123');
  console.log('   Admin: admin@test.com / admin123');
  console.log('🔐 Secret Admin URL: /secret-admin-portal-2024');
  console.log('⚠️  Using MOCK data - no MongoDB required');
  console.log('🎯 Features: Multi-language, Viral sharing, Admin boost');
  console.log('👑 Admin Dashboard: Real-time analytics & AI monitoring');
});