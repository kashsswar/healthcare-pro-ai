// AI Marketing Automation Script
// Run this to generate and distribute marketing content

const axios = require('axios');

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

async function generateOutreachContent() {
  try {
    console.log('🤖 Generating AI marketing content...');
    
    // Generate patient outreach content
    const patientContent = await axios.get(`${API_BASE}/api/outreach-marketing/generate-outreach-content?platform=social&target=patient`);
    console.log('\n📱 Patient Social Media Content:');
    patientContent.data.content.forEach((content, index) => {
      console.log(`${index + 1}. ${content}`);
    });
    
    // Generate doctor outreach content  
    const doctorContent = await axios.get(`${API_BASE}/api/outreach-marketing/generate-outreach-content?platform=social&target=doctor`);
    console.log('\n👨‍⚕️ Doctor Social Media Content:');
    doctorContent.data.content.forEach((content, index) => {
      console.log(`${index + 1}. ${content}`);
    });
    
    // Generate health awareness content
    const healthAwareness = await axios.get(`${API_BASE}/api/outreach-marketing/health-awareness`);
    console.log('\n💡 Health Awareness Content:');
    console.log(`Topic: ${healthAwareness.data.topic}`);
    console.log(`Content: ${healthAwareness.data.content}`);
    console.log(`CTA: ${healthAwareness.data.cta}`);
    
    // Generate problem-solution content
    const problemSolution = await axios.get(`${API_BASE}/api/outreach-marketing/problem-solution`);
    console.log('\n🎯 Problem-Solution Content:');
    console.log(`Problem: ${problemSolution.data.problem}`);
    console.log(`Solution: ${problemSolution.data.solution}`);
    console.log(`Audience: ${problemSolution.data.audience}`);
    
    console.log('\n✅ Marketing content generated successfully!');
    console.log('\n📋 Next Steps:');
    console.log('1. Copy the content above');
    console.log('2. Post on social media platforms');
    console.log('3. Share in relevant health groups');
    console.log('4. Send to potential users via WhatsApp/Email');
    console.log('5. Run this script daily for fresh content');
    
  } catch (error) {
    console.error('❌ Error generating content:', error.message);
  }
}

// Auto-generate content every 24 hours
function startAutomation() {
  console.log('🚀 Starting AI Marketing Automation...');
  
  // Generate content immediately
  generateOutreachContent();
  
  // Then generate new content every 24 hours
  setInterval(() => {
    console.log('\n⏰ 24 hours passed - Generating fresh content...');
    generateOutreachContent();
  }, 24 * 60 * 60 * 1000); // 24 hours
}

// Run if called directly
if (require.main === module) {
  startAutomation();
}

module.exports = { generateOutreachContent, startAutomation };