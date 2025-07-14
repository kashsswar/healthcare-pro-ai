const OpenAI = require('openai');
const nodemailer = require('nodemailer');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class AIMarketingService {
  // Generate personalized health content for social media
  static async generateHealthContent(specialization, targetAudience = 'general') {
    try {
      const prompt = `Create engaging health content for ${specialization} targeting ${targetAudience}. 
      Include:
      1. Health tip
      2. Common myth busting
      3. When to see a doctor
      4. Call-to-action for booking
      
      Make it social media friendly, under 200 words, engaging tone.`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.7
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('AI content generation error:', error);
      return null;
    }
  }

  // Generate WhatsApp marketing messages
  static async generateWhatsAppMessage(doctorName, specialization, location) {
    try {
      const prompt = `Create a WhatsApp marketing message for:
      Doctor: ${doctorName}
      Specialization: ${specialization}
      Location: ${location}
      
      Make it:
      - Personal and trustworthy
      - Include benefits of online consultation
      - Add urgency but not pushy
      - Include booking call-to-action
      - Under 100 words
      - Use emojis appropriately`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.8
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('WhatsApp message generation error:', error);
      return null;
    }
  }

  // Generate SEO-optimized blog content
  static async generateBlogContent(topic, keywords) {
    try {
      const prompt = `Write an SEO-optimized blog post about "${topic}" for a healthcare platform.
      Target keywords: ${keywords.join(', ')}
      
      Include:
      - Engaging title
      - Introduction with problem
      - 3-4 main sections
      - Conclusion with CTA to book doctor
      - Meta description
      
      Make it 800-1000 words, informative, and trustworthy.`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1500,
        temperature: 0.6
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Blog content generation error:', error);
      return null;
    }
  }

  // Generate patient testimonials (for inspiration)
  static async generateTestimonialTemplate(specialization, issue) {
    try {
      const prompt = `Create a realistic patient testimonial template for ${specialization} treating ${issue}.
      
      Include:
      - Patient's problem (anonymized)
      - Doctor's approach
      - Treatment outcome
      - Recommendation
      
      Make it authentic, emotional, and trustworthy. Use first person.`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 250,
        temperature: 0.7
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Testimonial generation error:', error);
      return null;
    }
  }

  // Auto-generate email campaigns
  static async generateEmailCampaign(campaignType, targetAudience) {
    try {
      const prompt = `Create an email campaign for healthcare platform:
      Campaign Type: ${campaignType}
      Target: ${targetAudience}
      
      Include:
      - Compelling subject line
      - Email body with health value
      - Clear call-to-action
      - Professional tone
      
      Make it conversion-focused and trustworthy.`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 400,
        temperature: 0.7
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Email campaign generation error:', error);
      return null;
    }
  }

  // Generate local marketing content
  static async generateLocalContent(city, healthIssue) {
    try {
      const prompt = `Create local healthcare marketing content for ${city} focusing on ${healthIssue}.
      
      Include:
      - Local health statistics/concerns
      - Why online consultation helps
      - Local doctor availability
      - Community trust building
      - Call-to-action
      
      Make it locally relevant and trustworthy.`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 350,
        temperature: 0.7
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Local content generation error:', error);
      return null;
    }
  }

  // Auto-schedule and send marketing content
  static async scheduleMarketingCampaign(doctors, patients) {
    const campaigns = [];
    
    // Generate content for each specialization
    for (const doctor of doctors) {
      const content = await this.generateHealthContent(doctor.specialization);
      const whatsappMsg = await this.generateWhatsAppMessage(
        doctor.userId.name, 
        doctor.specialization, 
        doctor.location.city
      );
      
      campaigns.push({
        doctorId: doctor._id,
        specialization: doctor.specialization,
        socialContent: content,
        whatsappMessage: whatsappMsg,
        scheduledFor: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000) // Random time in next 7 days
      });
    }
    
    return campaigns;
  }
}

module.exports = AIMarketingService;