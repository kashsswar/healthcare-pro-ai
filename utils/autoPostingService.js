const nodemailer = require('nodemailer');
const axios = require('axios');

class AutoPostingService {
  // Email service setup
  static setupEmailService() {
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // Send bulk emails to patients
  static async sendBulkEmails(patients, subject, content) {
    const transporter = this.setupEmailService();
    const results = [];

    for (const patient of patients) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: patient.email,
          subject: subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2196F3;">HealthCare Pro</h2>
              ${content}
              <br><br>
              <a href="${process.env.FRONTEND_URL}" style="background: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Book Appointment Now
              </a>
              <p style="color: #666; font-size: 12px; margin-top: 20px;">
                Unsubscribe: <a href="${process.env.FRONTEND_URL}/unsubscribe">Click here</a>
              </p>
            </div>
          `
        });
        results.push({ email: patient.email, status: 'sent' });
      } catch (error) {
        results.push({ email: patient.email, status: 'failed', error: error.message });
      }
    }
    return results;
  }

  // WhatsApp Business API integration
  static async sendWhatsAppMessage(phoneNumber, message) {
    try {
      // Using WhatsApp Business API (requires setup)
      const response = await axios.post('https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages', {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'text',
        text: { body: message }
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      return { success: true, messageId: response.data.messages[0].id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Send bulk WhatsApp messages
  static async sendBulkWhatsApp(patients, message) {
    const results = [];
    
    for (const patient of patients) {
      if (patient.phone) {
        const result = await this.sendWhatsAppMessage(patient.phone, message);
        results.push({ 
          phone: patient.phone, 
          name: patient.name,
          ...result 
        });
        
        // Delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    return results;
  }

  // Facebook/Instagram posting
  static async postToFacebook(content, imageUrl = null) {
    try {
      const postData = {
        message: content,
        access_token: process.env.FACEBOOK_ACCESS_TOKEN
      };

      if (imageUrl) {
        postData.url = imageUrl;
      }

      const response = await axios.post(
        `https://graph.facebook.com/v17.0/${process.env.FACEBOOK_PAGE_ID}/photos`,
        postData
      );

      return { success: true, postId: response.data.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Twitter/X posting
  static async postToTwitter(content) {
    try {
      // Using Twitter API v2
      const response = await axios.post('https://api.twitter.com/2/tweets', {
        text: content
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      return { success: true, tweetId: response.data.data.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Google Ads campaign creation
  static async createGoogleAd(keywords, adContent, budget = 1000) {
    try {
      // Google Ads API integration
      const campaignData = {
        name: `Healthcare Campaign - ${Date.now()}`,
        keywords: keywords,
        ad_content: adContent,
        daily_budget: budget,
        target_location: 'India'
      };

      // This would integrate with Google Ads API
      console.log('Google Ad Campaign Created:', campaignData);
      return { success: true, campaignId: `campaign_${Date.now()}` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // SMS marketing
  static async sendBulkSMS(patients, message) {
    const results = [];
    
    for (const patient of patients) {
      try {
        // Using SMS service like Twilio
        const response = await axios.post('https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json', {
          From: process.env.TWILIO_PHONE_NUMBER,
          To: patient.phone,
          Body: message
        }, {
          auth: {
            username: process.env.TWILIO_ACCOUNT_SID,
            password: process.env.TWILIO_AUTH_TOKEN
          }
        });

        results.push({ phone: patient.phone, status: 'sent', sid: response.data.sid });
      } catch (error) {
        results.push({ phone: patient.phone, status: 'failed', error: error.message });
      }
    }
    return results;
  }

  // Auto-post to all platforms
  static async postToAllPlatforms(content, patients) {
    const results = {
      email: [],
      whatsapp: [],
      facebook: null,
      twitter: null,
      sms: []
    };

    // Email campaign
    if (patients.length > 0) {
      results.email = await this.sendBulkEmails(patients, 'Health Update from HealthCare Pro', content);
    }

    // WhatsApp campaign
    if (patients.length > 0) {
      results.whatsapp = await this.sendBulkWhatsApp(patients, content);
    }

    // Social media posts
    results.facebook = await this.postToFacebook(content);
    results.twitter = await this.postToTwitter(content);

    // SMS campaign (optional)
    if (patients.length > 0) {
      results.sms = await this.sendBulkSMS(patients, content.substring(0, 160)); // SMS limit
    }

    return results;
  }
}

module.exports = AutoPostingService;