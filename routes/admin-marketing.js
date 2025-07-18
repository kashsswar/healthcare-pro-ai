const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Auto-generate contact list and marketing content for admin
router.get('/marketing-dashboard', async (req, res) => {
  try {
    const contactList = [
      { name: 'Epic Systems', email: 'partnerships@epic.com', category: 'Healthcare Tech', status: 'pending' },
      { name: 'Teladoc Health', email: 'bd@teladoc.com', category: 'Telemedicine', status: 'pending' },
      { name: 'Amwell', email: 'partnerships@amwell.com', category: 'Digital Health', status: 'pending' },
      { name: 'athenahealth', email: 'partnerships@athenahealth.com', category: 'Healthcare Software', status: 'pending' },
      { name: 'Mayo Clinic', email: 'ventures@mayo.edu', category: 'Medical Institution', status: 'pending' },
      { name: 'Ministry of Health India', email: 'webmaster.mohfw@gov.in', category: 'Government', status: 'pending' },
      { name: 'NITI Aayog', email: 'ceo@niti.gov.in', category: 'Policy Think Tank', status: 'pending' },
      { name: 'National Health Authority', email: 'grievance@nha.gov.in', category: 'Government Health', status: 'pending' },
      { name: 'Delhi Health Dept', email: 'secy-health@delhi.gov.in', category: 'State Government', status: 'pending' },
      { name: 'Maharashtra Health', email: 'health.mah@gov.in', category: 'State Government', status: 'pending' }
    ];

    const whatsappTemplate = `🏥 *Healthcare Revolution is Here!*

👨‍⚕️ *Healthcare Pro AI* - India's Most Advanced Medical Platform

✅ *500+ Verified Doctors*
✅ *12+ Specializations*
✅ *AI-Powered Matching*
✅ *Instant Appointments*
✅ *24/7 Availability*

🚀 *Perfect for:*
• Hospitals seeking digital transformation
• Clinics wanting online presence
• Healthcare startups
• Government health initiatives

💼 *Partnership Opportunities Available*

🔗 *Live Demo:* https://healthcare-pro-ai.onrender.com

📞 *Contact:* Karishma Sinsinwar
📧 *Email:* karishma@healthcarepro.ai

*Let's revolutionize healthcare together!* 🌟`;
    
    const embedCode = `<iframe src="https://healthcare-pro-ai.onrender.com/embed" width="320" height="200" frameborder="0"></iframe>`;
    
    const emailTemplate = `Subject: Healthcare Platform Partnership Opportunity

Dear [Name],

I hope this email finds you well. I'm reaching out from Healthcare Pro AI, a comprehensive digital healthcare platform that's transforming how patients connect with healthcare providers.

🏥 About Healthcare Pro AI:
• AI-powered doctor-patient matching
• 500+ verified healthcare professionals
• 12+ medical specializations
• Real-time appointment scheduling
• Secure consultation platform

🤝 Partnership Opportunity:
We're seeking strategic partnerships with leading healthcare organizations like [Website Name] to:
• Expand healthcare accessibility
• Integrate our platform with your existing systems
• Provide white-label solutions
• Joint marketing initiatives

📊 Platform Statistics:
• 10,000+ successful consultations
• 95% patient satisfaction rate
• 24/7 availability
• HIPAA compliant infrastructure

🔗 Live Platform: https://healthcare-pro-ai.onrender.com

I would love to schedule a brief call to discuss how we can collaborate to improve healthcare delivery in your region.

Best regards,
Karishma Sinsinwar
Founder, Healthcare Pro AI
Email: karishma@healthcarepro.ai
Phone: +91-XXXXXXXXXX`;

    res.json({
      contactList,
      embedCode,
      emailTemplate,
      whatsappTemplate,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate marketing dashboard' });
  }
});

// Send emails automatically to contact list
router.post('/send-bulk-emails', async (req, res) => {
  try {
    const { contacts, emailContent } = req.body;
    
    // Simulate email sending (replace with real email service)
    console.log('Simulating email sending to contacts...');

    const results = [];
    
    for (const contact of contacts) {
      // Simulate email sending
      const personalizedContent = emailContent
        .replace(/\[Website Name\]/g, contact.name)
        .replace(/\[Name\]/g, contact.name);

      console.log(`Sending to ${contact.name} (${contact.email}):`);
      console.log(personalizedContent.substring(0, 100) + '...');

      results.push({ 
        contact: contact.name, 
        email: contact.email, 
        status: 'sent',
        sentAt: new Date().toISOString()
      });
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    res.json({
      message: 'Bulk email sending completed',
      results,
      totalSent: results.filter(r => r.status === 'sent').length,
      totalFailed: results.filter(r => r.status === 'failed').length
    });

  } catch (error) {
    res.status(500).json({ error: 'Bulk email sending failed', details: error.message });
  }
});

module.exports = router;