// Debug script - paste in browser console to check appointments

console.log('=== APPOINTMENT DEBUG ===');

// Check localStorage
const appointments = JSON.parse(localStorage.getItem('bookedAppointments') || '[]');
console.log('Total appointments in localStorage:', appointments.length);
console.log('All appointments:', appointments);

// Check current user
const user = JSON.parse(localStorage.getItem('user') || '{}');
console.log('Current user:', user);
console.log('Doctor ID:', user.doctorId || user._id || user.id);

// Filter appointments for current doctor
const doctorId = user.doctorId || user._id || user.id;
const doctorAppointments = appointments.filter(apt => 
  apt.doctorId === doctorId || apt.doctor === doctorId
);
console.log('Appointments for current doctor:', doctorAppointments);

// Add test appointment if none exist
if (appointments.length === 0) {
  const testAppointment = {
    _id: Date.now().toString(),
    patient: {
      name: 'Test Patient',
      email: 'test@email.com',
      phone: '+91-9876543210'
    },
    doctorId: doctorId,
    doctor: doctorId,
    scheduledTime: new Date().toISOString(),
    symptoms: ['headache', 'fever'],
    status: 'scheduled',
    createdAt: new Date().toISOString()
  };
  
  appointments.push(testAppointment);
  localStorage.setItem('bookedAppointments', JSON.stringify(appointments));
  console.log('Added test appointment:', testAppointment);
  
  alert('Test appointment added! Refreshing page...');
  setTimeout(() => window.location.reload(), 1000);
}