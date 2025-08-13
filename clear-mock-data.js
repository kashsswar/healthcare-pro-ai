// Clear Mock Data Script
// Run this in browser console to remove any remaining mock data

console.log('🧹 Clearing mock data from localStorage...');

// Clear any mock doctor profiles with default names
let cleared = 0;
for (let i = localStorage.length - 1; i >= 0; i--) {
  const key = localStorage.key(i);
  if (key && key.startsWith('doctor_') && key.endsWith('_profile')) {
    try {
      const profile = JSON.parse(localStorage.getItem(key));
      // Remove profiles with default names or incomplete data
      if (!profile.name || profile.name === 'Doctor' || !profile.city || !profile.specialization) {
        localStorage.removeItem(key);
        cleared++;
        console.log(`🗑️ Removed mock profile: ${key}`);
      }
    } catch (error) {
      // Remove corrupted profiles
      localStorage.removeItem(key);
      cleared++;
      console.log(`🗑️ Removed corrupted profile: ${key}`);
    }
  }
}

console.log(`✅ Cleared ${cleared} mock doctor profiles`);
console.log('🏥 Only real doctor profiles with complete information remain');
console.log('🔄 Please refresh the page to see updated doctor list');