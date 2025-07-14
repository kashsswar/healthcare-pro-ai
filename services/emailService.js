const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.mockMode = process.env.EMAIL_MOCK_MODE === 'true' || process.env.NODE_ENV !== 'production';
    
    if (this.mockMode) {
      console.log('📧 EMAIL SERVICE: Running in MOCK mode - No real emails sent');
    } else {
      this.transporter = nodemailer.createTransporter({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    }
  }

  async sendAppointmentConfirmation(patientEmail, appointmentData) {
    const emailContent = {
      to: patientEmail,
      subject: '🏥 Appointment Confirmed - HealthCare Pro',
      html: `
        <h2>🏥 HealthCare Pro - Appointment Confirmed</h2>
        <p>Dear ${appointmentData.patientName},</p>
        <p>Your appointment has been confirmed:</p>
        <ul>
          <li>Doctor: Dr. ${appointmentData.doctorName}</li>
          <li>Date: ${appointmentData.date}</li>
          <li>Time: ${appointmentData.time}</li>
          <li>Fee: ₹${appointmentData.fee}</li>
        </ul>
        <p>Thank you for choosing HealthCare Pro!</p>
      `
    };

    return this.sendEmail(emailContent);
  }

  async sendAdminEarningsReport(adminEmail, earningsData) {
    const emailContent = {
      to: adminEmail || 'kashsswar@gmail.com',
      subject: '📊 Daily Earnings Report - HealthCare Pro',
      html: `
        <h2>📊 Your Daily Earnings Report</h2>
        <p>Date: ${earningsData.date}</p>
        <p>Total Consultations: ${earningsData.consultations}</p>
        <p>Platform Revenue: ₹${earningsData.totalRevenue}</p>
        <p><strong>Your Commission (20%): ₹${earningsData.adminEarnings}</strong></p>
        <p>Top Earning Doctor: Dr. ${earningsData.topDoctor}</p>
      `
    };

    return this.sendEmail(emailContent);
  }

  async sendEmail(emailData) {
    if (this.mockMode) {
      console.log('📧 MOCK EMAIL SENT:');
      console.log(`To: ${emailData.to}`);
      console.log(`Subject: ${emailData.subject}`);
      console.log('✅ Email logged (not actually sent in development)');
      return { success: true, messageId: 'mock-' + Date.now() };
    }

    try {
      const result = await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        ...emailData
      });
      console.log('✅ Real email sent to:', emailData.to);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Email send failed:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();