const cron = require('node-cron');
const axios = require('axios');

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Auto-distribute marketing content to web platforms
async function distributeContent() {
  try {
    console.log('🤖 Auto-distributing marketing content...');
    
    // Generate fresh content
    const patientRes = await axios.get(`${API_BASE}/api/outreach-marketing/generate-outreach-content?platform=social&target=patient`);
    const healthRes = await axios.get(`${API_BASE}/api/outreach-marketing/health-awareness`);
    
    const content = patientRes.data.content[0];
    const healthTip = healthRes.data;
    
    // Create authentic web notifications (non-intrusive)
    const webNotifications = [
      {
        type: 'health-tip',
        title: `Health Tip: ${healthTip.topic}`,
        message: healthTip.content,
        cta: 'Learn More',
        url: 'https://healthcare-pro-ai.onrender.com'
      },
      {
        type: 'healthcare-solution',
        title: 'Healthcare Made Simple',
        message: content,
        cta: 'Try Free',
        url: 'https://healthcare-pro-ai.onrender.com'
      }
    ];
    
    // Save to database for widget display
    await saveMarketingContent(webNotifications);
    
    console.log('✅ Content distributed successfully');
    
  } catch (error) {
    console.error('❌ Distribution failed:', error.message);
  }
}

async function saveMarketingContent(notifications) {
  // This would save to your database for the widget to display
  console.log('📝 Saving marketing content for web display...');
  notifications.forEach((notif, index) => {
    console.log(`${index + 1}. ${notif.title}: ${notif.message}`);
  });
}

// Run every 24 hours at 9 AM
cron.schedule('0 9 * * *', () => {
  console.log('⏰ Daily marketing automation triggered at 9 AM');
  distributeContent();
});

// Run immediately on start
distributeContent();

console.log('🚀 Auto-marketing cron job started - runs daily at 9 AM');

module.exports = { distributeContent };