const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (for demo without MongoDB)
let users = [
  { _id: '1', name: 'John Doe', email: 'patient@test.com', password: 'password123', role: 'patient' },
  { _id: '2', name: 'Dr. Sarah Johnson', email: 'sarah.johnson@healthconnect.com', password: 'password123', role: 'doctor' }
];

let doctors = [
  { _id: '1', userId: '2', specialization: 'General Medicine', experience: 8, consultationFee: 500, rating: 4.5, isFeatured: true, location: { city: 'Mumbai' }, availability: [{ day: 'Monday', startTime: '09:00', endTime: '17:00', isAvailable: true }] },
  { _id: '2', userId: '3', specialization: 'Cardiology', experience: 12, consultationFee: 800, rating: 4.8, location: { city: 'Delhi' }, availability: [{ day: 'Monday', startTime: '10:00', endTime: '18:00', isAvailable: true }] }
];

// Auth routes
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, specialization, experience, consultationFee } = req.body;
  
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = {
    _id: String(users.length + 1),
    name, email, password, role
  };
  users.push(newUser);

  if (role === 'doctor') {
    const newDoctor = {
      _id: String(doctors.length + 1),
      userId: newUser._id,
      specialization: specialization || 'General Medicine',
      experience: parseInt(experience) || 5,
      consultationFee: parseInt(consultationFee) || 500,
      rating: 4.0,
      location: { city: 'Mumbai' },
      availability: [{ day: 'Monday', startTime: '09:00', endTime: '17:00', isAvailable: true }]
    };
    doctors.push(newDoctor);
  }

  res.status(201).json({
    token: 'demo-token',
    user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({
    token: 'demo-token',
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
});

// Doctor routes
app.get('/api/doctors/specializations', (req, res) => {
  const specializations = [
    'General Medicine', 'Cardiology', 'Dermatology', 'Pediatrics', 'Dentistry',
    'Orthopedic Surgery', 'Neurology', 'Gynecology', 'ENT (Ear, Nose, Throat)',
    'Ophthalmology', 'Psychiatry', 'Radiology', 'Anesthesiology', 'Other (Please Specify)'
  ];
  res.json(specializations);
});

app.get('/api/doctors/by-specialization', (req, res) => {
  const doctorsBySpec = {};
  
  doctors.forEach(doctor => {
    const user = users.find(u => u._id === doctor.userId);
    const spec = doctor.specialization;
    
    if (!doctorsBySpec[spec]) {
      doctorsBySpec[spec] = [];
    }
    
    doctorsBySpec[spec].push({
      ...doctor,
      userId: user,
      availability: {
        isAvailable: true,
        timings: { from: '09:00', to: '17:00' }
      }
    });
  });
  
  res.json(doctorsBySpec);
});

app.get('/api/doctors', (req, res) => {
  const doctorsWithUsers = doctors.map(doctor => {
    const user = users.find(u => u._id === doctor.userId);
    return { ...doctor, userId: user };
  });
  res.json(doctorsWithUsers);
});

// Serve static files
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔧 Backend API: http://localhost:${PORT}/api`);
  console.log(`👤 Test Login: patient@test.com / password123`);
});