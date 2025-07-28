// AI-generated contact information for healthcare platform sales
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class SalesContactGenerator {
  static async generateTargetContacts() {
    const prompt = `
    Generate a list of 20 potential buyers for a healthcare platform with the following features:
    - Doctor-patient booking system
    - 12+ medical specializations
    - Real-time availability
    - Admin dashboard
    - Built with Node.js, React, MongoDB

    For each contact, provide:
    1. Company name
    2. Industry focus
    3. Estimated company size
    4. Why they'd be interested
    5. Suggested contact approach

    Format as JSON array with objects containing: name, industry, size, interest, approach
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
        temperature: 0.7
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error generating contacts:', error);
      return this.getFallbackContacts();
    }
  }

  static getFallbackContacts() {
    return [
      {
        name: "Epic Systems Corporation",
        industry: "Healthcare Software",
        size: "Large Enterprise (10,000+ employees)",
        interest: "Electronic health records integration",
        approach: "Focus on interoperability and scalability",
        email: "partnerships@epic.com"
      },
      {
        name: "Teladoc Health",
        industry: "Telemedicine",
        size: "Large Public Company",
        interest: "Expanding telehealth capabilities",
        approach: "Emphasize real-time booking and specialization coverage",
        email: "business.development@teladoc.com"
      },
      {
        name: "Amwell",
        industry: "Digital Health Platform",
        size: "Mid-Large Enterprise",
        interest: "White-label healthcare solutions",
        approach: "Highlight customization and branding options",
        email: "partnerships@amwell.com"
      },
      {
        name: "athenahealth",
        industry: "Healthcare Technology",
        size: "Large Enterprise",
        interest: "Practice management solutions",
        approach: "Focus on admin dashboard and analytics",
        email: "partnerships@athenahealth.com"
      },
      {
        name: "Cerner Corporation",
        industry: "Health Information Technology",
        size: "Large Enterprise",
        interest: "Patient engagement platforms",
        approach: "Emphasize user experience and integration capabilities",
        email: "business.development@cerner.com"
      }
    ];
  }

  static async generatePersonalizedEmail(company, platform_features) {
    const prompt = `
    Write a personalized sales email for ${company.name} about acquiring our healthcare platform.
    
    Company details: ${JSON.stringify(company)}
    
    Platform features:
    - Doctor registration and patient booking
    - 12+ medical specializations  
    - Real-time availability tracking
    - Admin dashboard
    - Node.js, React, MongoDB tech stack
    - AI-powered specialization validation
    
    Make it professional, compelling, and specific to their business needs.
    Include a clear call-to-action and pricing hint ($75K-$1.2M range).
    Keep it under 300 words.
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.8
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating email:', error);
      return `Subject: Healthcare Platform Acquisition Opportunity - ${company.name}

Dear ${company.name} Team,

I'm reaching out regarding a fully-developed healthcare platform that could significantly enhance your ${company.industry} offerings.

Our platform features:
• 12+ medical specializations with AI validation
• Real-time doctor availability system
• Comprehensive admin dashboard
• Modern tech stack (Node.js, React, MongoDB)

Given ${company.name}'s focus on ${company.interest}, this platform could provide immediate value through ${company.approach}.

Investment range: $75,000 - $1,200,000 depending on licensing model.

Available for demo within 24 hours. Let's discuss how this aligns with your strategic goals.

Best regards,
[Your Name]`;
    }
  }
}

module.exports = SalesContactGenerator;
