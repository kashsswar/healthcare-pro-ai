const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Auto-generate contact list and marketing content for admin
router.get('/marketing-dashboard', async (req, res) => {
  try {
    const contactList = [
      { name: 'Healthline', email: 'partnerships@healthline.com', category: 'Health Blog', status: 'pending' },
      { name: 'WebMD', email: 'business@webmd.com', category: 'Medical Info', status: 'pending' },
      { name: 'Medical News Today', email: 'partnerships@medicalnewstoday.com', category: 'Medical News', status: 'pending' },
      { name: 'Verywell Health', email: 'partnerships@verywellhealth.com', category: 'Health Advice', status: 'pending' },
      { name: 'Mayo Clinic', email: 'socialmedia@mayo.edu', category: 'Medical Institution', status: 'pending' },
      { name: 'MyFitnessPal', email: 'partnerships@myfitnesspal.com', category: 'Fitness', status: 'pending' },
      { name: 'Yoga Journal', email: 'editor@yogajournal.com', category: 'Wellness', status: 'pending' },
      { name: 'Men\'s Health', email: 'mh-letters@hearst.com', category: 'Men\'s Fitness', status: 'pending' },
      { name: 'Women\'s Health', email: 'letters@womenshealthmag.com', category: 'Women\'s Wellness', status: 'pending' },
      { name: 'Shape Magazine', email: 'shape@shape.com', category: 'Fitness Lifestyle', status: 'pending' }
    ];

    const embedCode = `<iframe src="https://healthcare-pro-ai.onrender.com/embed" width="320" height="200" frameborder="0"></iframe>`;
    
    const emailTemplate = `Subject: Free Health Widget for [Website Name]

Hi [Name],

I noticed [Website Name] provides valuable health content to your audience.

Would you be interested in a free health awareness widget that provides daily health tips and connects visitors with verified doctors?

🔹 Completely free to use
🔹 Non-intrusive design
🔹 Adds value to your visitors
🔹 Professional medical content

Preview: https://healthcare-pro-ai.onrender.com/embed

Embed code:
<iframe src="https://healthcare-pro-ai.onrender.com/embed" width="320" height="200" frameborder="0"></iframe>

The widget rotates through authentic health tips and allows visitors to connect with healthcare professionals when needed.

Would you like to try it on your site?

Best regards,
Healthcare Pro AI Team`;

    res.json({
      contactList,
      embedCode,
      emailTemplate,
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
    
    // Configure email transporter (you'll need to add your email credentials)
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
      }
    });

    const results = [];
    
    for (const contact of contacts) {
      try {
        const personalizedContent = emailContent
          .replace(/\[Website Name\]/g, contact.name)
          .replace(/\[Name\]/g, contact.name);

        await transporter.sendMail({
          from: process.env.EMAIL_USER || 'your-email@gmail.com',
          to: contact.email,
          subject: `Free Health Widget for ${contact.name}`,
          text: personalizedContent
        });

        results.push({ 
          contact: contact.name, 
          email: contact.email, 
          status: 'sent',
          sentAt: new Date().toISOString()
        });
        
        // Add delay to avoid spam detection
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        results.push({ 
          contact: contact.name, 
          email: contact.email, 
          status: 'failed',
          error: error.message
        });
      }
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