const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Setup email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Get marketing dashboard data
router.get('/marketing-dashboard', async (req, res) => {
  try {
    // Mock contact list for demo
    const contactList = [
      { name: 'John Doe', email: 'john@example.com', category: 'Patient', status: 'Active' },
      { name: 'Jane Smith', email: 'jane@example.com', category: 'Doctor', status: 'Pending' },
      { name: 'Dr. Kumar', email: 'kumar@example.com', category: 'Doctor', status: 'Active' }
    ];

    const emailTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2196F3;">🏥 HealthCare Pro</h2>
      <p>Dear Healthcare Professional,</p>
      <p>Join India's fastest growing healthcare platform!</p>
      
      <h3>🚀 Benefits:</h3>
      <ul>
        <li>Get patients online instantly</li>
        <li>Earn ₹500-₹1000 per consultation</li>
        <li>Work from anywhere, anytime</li>
        <li>AI-powered patient matching</li>
      </ul>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://healthcare-pro-ai.onrender.com/register" 
           style="background: #2196F3; color: white; padding: 15px 30px; 
                  text-decoration: none; border-radius: 5px;">
          Register as Doctor
        </a>
      </div>
      
      <p>Best regards,<br>HealthCare Pro Team</p>
    </div>
    `;

    const embedCode = `<iframe src="https://healthcare-pro-ai.onrender.com/embed" width="100%" height="400"></iframe>`;

    res.json({
      contactList,
      emailTemplate,
      embedCode
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send bulk emails
router.post('/send-bulk-emails', async (req, res) => {
  try {
    const { contacts, emailContent } = req.body;

    // Check if email configuration exists
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(400).json({
        success: false,
        message: 'Email configuration missing. Please set EMAIL_USER and EMAIL_PASS in environment variables.',
        totalSent: 0,
        totalFailed: contacts?.length || 0,
        results: contacts?.map(contact => ({
          email: contact.email,
          contact: contact.name,
          status: 'failed',
          error: 'Email configuration missing'
        })) || []
      });
    }

    if (!contacts || contacts.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No contacts provided',
        totalSent: 0,
        totalFailed: 0,
        results: []
      });
    }

    const transporter = createTransporter();
    const results = [];
    let totalSent = 0;
    let totalFailed = 0;

    // Test email configuration first
    try {
      await transporter.verify();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Email configuration invalid. Check EMAIL_USER and EMAIL_PASS.',
        error: error.message,
        totalSent: 0,
        totalFailed: contacts.length,
        results: contacts.map(contact => ({
          email: contact.email,
          contact: contact.name,
          status: 'failed',
          error: 'Invalid email configuration'
        }))
      });
    }

    // Send emails
    for (const contact of contacts) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: contact.email,
          subject: '🏥 Join HealthCare Pro - Start Earning Online!',
          html: emailContent
        });

        results.push({
          email: contact.email,
          contact: contact.name,
          status: 'sent'
        });
        totalSent++;
      } catch (error) {
        results.push({
          email: contact.email,
          contact: contact.name,
          status: 'failed',
          error: error.message
        });
        totalFailed++;
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    res.json({
      success: true,
      message: `Email campaign completed! Sent: ${totalSent}, Failed: ${totalFailed}`,
      totalSent,
      totalFailed,
      results
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email sending failed',
      error: error.message,
      totalSent: 0,
      totalFailed: req.body.contacts?.length || 0,
      results: []
    });
  }
});

module.exports = router;