// Fix doctor name in appointments - run in browser console

console.log('=== FIXING DOCTOR NAMES ===');

// Get current appointments
const appointments = JSON.parse(localStorage.getItem('bookedAppointments') || '[]');
console.log('Current appointments:', appointments);

// Fix each appointment to have doctor name
const fixedAppointments = appointments.map(apt => {
  console.log('Fixing appointment:', apt._id);
  console.log('Current doctor data:', apt.doctor, apt.doctorName);
  
  return {
    ...apt,
    doctorName: 'Dr. Rubina', // Force set doctor name
    doctor: {
      ...apt.doctor,
      name: 'Dr. Rubina',
      userId: { name: 'Rubina' },
      specialization: 'Cardiology'
    }
  };
});

// Save fixed appointments
localStorage.setItem('bookedAppointments', JSON.stringify(fixedAppointments));
console.log('Fixed appointments:', fixedAppointments);

alert('Doctor names fixed! Refreshing page...');
setTimeout(() => window.location.reload(), 1000);