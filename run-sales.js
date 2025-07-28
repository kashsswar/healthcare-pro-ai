// Quick script to generate sales emails using AI
require('dotenv').config();
const { runSalesAutomation } = require('./sales-automation');

console.log('💰 Healthcare Platform Sales Generator');
console.log('=====================================\n');

// Run the sales automation
runSalesAutomation().then(() => {
  console.log('\n🎯 Next Steps:');
  console.log('1. Copy emails from output above');
  console.log('2. Send to target companies');
  console.log('3. Follow up within 3-5 days');
  console.log('4. Schedule demos for interested parties');
  console.log('\n💡 Pro Tip: Customize company names and add personal touches before sending!');
}).catch(error => {
  console.error('Error:', error.message);
});
