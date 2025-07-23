// Check admin rating boost - run in browser console

console.log('=== CHECKING ADMIN RATING BOOST ===');

const doctorId = '687ddeca768e37aa5629da85'; // Your doctor ID

// Check all possible localStorage keys
console.log('adminRatingBoosts:', JSON.parse(localStorage.getItem('adminRatingBoosts') || '[]'));
console.log('doctorBoosts:', JSON.parse(localStorage.getItem('doctorBoosts') || '[]'));
console.log('ratingBoosts:', JSON.parse(localStorage.getItem('ratingBoosts') || '[]'));
console.log('doctor data:', JSON.parse(localStorage.getItem(`doctor_${doctorId}`) || '{}'));

// Check all localStorage keys that might contain rating data
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key.includes('rating') || key.includes('boost') || key.includes('admin')) {
    console.log(`${key}:`, JSON.parse(localStorage.getItem(key) || '{}'));
  }
}

// Add test admin boost if none exists
const testBoost = {
  doctorId: doctorId,
  boostAmount: 0.5,
  reason: 'Test admin boost',
  createdAt: new Date().toISOString()
};

const adminBoosts = JSON.parse(localStorage.getItem('adminRatingBoosts') || '[]');
adminBoosts.push(testBoost);
localStorage.setItem('adminRatingBoosts', JSON.stringify(adminBoosts));

console.log('Added test admin boost:', testBoost);
alert('Admin boost added! Refresh page to see changes.');