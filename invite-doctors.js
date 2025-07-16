require('dotenv').config();
const nodemailer = require('nodemailer');

const doctorInvites = [
  { name: "Dr. Rajesh Kumar", email: "rajesh.kumar@example.com", specialization: "Cardiology" },
  { name: "Dr. Priya Sharma", email: "priya.sharma@example.com", specialization: "Dermatology" },
  { name: "Dr. Amit Patel", email: "amit.patel@example.com", specialization: "Orthopedics" },
  // Add real doctor emails here
];

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function inviteDoctors() {
  const registrationLink = 'https://healthcare-pro-ai.onrender.com/register';
  
  for (const doctor of doctorInvites) {
    const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2196F3;">🏥 HealthCare Pro - Doctor Invitation</h2>
      
      <p>Dear ${doctor.name},</p>
      
      <p>You're invited to join <strong>HealthCare Pro</strong> - India's fastest growing healthcare platform!</p>
      
      <h3>🚀 Why Join Us?</h3>
      <ul>
        <li>📱 Get patients online instantly</li>
        <li>💰 Earn ₹500-₹1000 per consultation</li>
        <li>⏰ Flexible working hours</li>
        <li>🎯 AI-powered patient matching</li>
        <li>📊 Professional dashboard</li>
      </ul>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${registrationLink}" 
           style="background: #2196F3; color: white; padding: 15px 30px; 
                  text-decoration: none; border-radius: 5px; font-size: 18px;">
          🏥 Register as Doctor
        </a>
      </div>
      
      <h3>📋 Registration Steps:</h3>
      <ol>
        <li>Click the registration link above</li>
        <li>Select "Doctor" during signup</li>
        <li>Fill your specialization: <strong>${doctor.specialization}</strong></li>
        <li>Set your consultation fee</li>
        <li>Start receiving patients!</li>
      </ol>
      
      <p><strong>🎁 Early Bird Bonus:</strong> First 50 doctors get featured listing for FREE!</p>
      
      <p>Questions? Reply to this email or call +91-XXXXXXXXXX</p>
      
      <p>Best regards,<br>
      HealthCare Pro Team</p>
    </div>
    `;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: doctor.email,
        subject: '🏥 Join HealthCare Pro - Start Earning Online!',
        html: emailContent
      });
      
      console.log(`✅ Invitation sent to ${doctor.name} (${doctor.email})`);
    } catch (error) {
      console.log(`❌ Failed to send to ${doctor.name}: ${error.message}`);
    }
  }
}

inviteDoctors();