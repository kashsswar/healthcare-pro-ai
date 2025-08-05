const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// In-memory storage
let doctors = [];
let patients = [];
let doctorReviews = [];
let adminBoosts = [];
let appointments = [];

// Doctor routes
app.get('/api/doctors', (req, res) => {
  res.json(doctors);
});

app.get('/api/doctors/categories', (req, res) => {
  const specializationIcons = {
    'General Medicine': '🩺',
    'Cardiology': '❤️',
    'Dermatology': '🧴',
    'Pediatrics': '👶',
    'Orthopedics': '🦴',
    'Gynecology': '👩‍⚕️',
    'Neurology': '🧠',
    'Psychiatry': '🧘',
    'Ophthalmology': '👁️',
    'ENT': '👂',
    'Dentistry': '🦷',
    'Sleep Medicine': '😴'
  };
  
  const specializationCounts = {};
  doctors.forEach(doctor => {
    const spec = doctor.specialization;
    specializationCounts[spec] = (specializationCounts[spec] || 0) + 1;
  });
  
  const categories = Object.keys(specializationCounts).map(spec => ({
    id: spec.toLowerCase().replace(/\s+/g, '-'),
    name: spec,
    icon: specializationIcons[spec] || '🏥',
    count: specializationCounts[spec]
  }));
  
  res.json(categories);
});

app.get('/api/doctor-profile/:doctorId', (req, res) => {
  const doctor = doctors.find(d => d._id === req.params.doctorId);
  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }
  
  const reviews = doctorReviews.filter(r => r.doctorId === req.params.doctorId);
  const avgRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 4.5;
  
  const boost = adminBoosts.find(b => b.doctorId === req.params.doctorId);
  const adminBoostRating = boost ? boost.boostAmount : 0;
  
  res.json({
    ...doctor,
    rating: avgRating,
    adminBoostRating,
    finalRating: Math.min(5.0, avgRating + adminBoostRating)
  });
});

app.put('/api/doctor-profile/:doctorId', (req, res) => {
  const doctorIndex = doctors.findIndex(d => d._id === req.params.doctorId);
  if (doctorIndex === -1) {
    doctors.push({ _id: req.params.doctorId, ...req.body });
  } else {
    doctors[doctorIndex] = { ...doctors[doctorIndex], ...req.body };
  }
  res.json({ message: 'Profile updated successfully' });
});

app.get('/api/appointments/doctor/:doctorId/stats', (req, res) => {
  const reviews = doctorReviews.filter(r => r.doctorId === req.params.doctorId);
  const completedAppointments = appointments.filter(apt => 
    apt.doctorId === req.params.doctorId && apt.status === 'completed'
  );
  
  res.json({
    reviewCount: reviews.length,
    completedAppointments: completedAppointments.length
  });
});

// Appointment routes
app.get('/api/appointments', (req, res) => {
  res.json(appointments);
});

app.post('/api/appointments', (req, res) => {
  const appointment = { _id: Date.now().toString(), ...req.body, createdAt: new Date() };
  appointments.push(appointment);
  res.json(appointment);
});

app.put('/api/appointments/:appointmentId', (req, res) => {
  const index = appointments.findIndex(apt => apt._id === req.params.appointmentId);
  if (index === -1) {
    return res.status(404).json({ message: 'Appointment not found' });
  }
  
  appointments[index] = { ...appointments[index], ...req.body };
  res.json(appointments[index]);
});

app.delete('/api/appointments/:appointmentId', (req, res) => {
  const index = appointments.findIndex(apt => apt._id === req.params.appointmentId);
  if (index === -1) {
    return res.status(404).json({ message: 'Appointment not found' });
  }
  
  const cancelled = appointments.splice(index, 1)[0];
  res.json({ message: 'Appointment cancelled', appointment: cancelled });
});

// Patient profile routes
app.get('/api/patient-profile/:patientId', (req, res) => {
  const patient = patients.find(p => p._id === req.params.patientId);
  if (!patient) {
    return res.status(404).json({ message: 'Patient not found' });
  }
  res.json(patient);
});

app.put('/api/patient-profile/:patientId', (req, res) => {
  const patientIndex = patients.findIndex(p => p._id === req.params.patientId);
  if (patientIndex === -1) {
    patients.push({ _id: req.params.patientId, ...req.body });
  } else {
    patients[patientIndex] = { ...patients[patientIndex], ...req.body };
  }
  res.json({ message: 'Patient profile updated successfully' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});