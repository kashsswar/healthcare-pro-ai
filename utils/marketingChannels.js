const marketingChannels = {
  // WHERE IT'S MARKETED
  channels: {
    whatsapp: {
      target: "Doctor WhatsApp groups, Medical college groups, Hospital staff groups",
      reach: "Direct messaging to 10,000+ medical professionals",
      content_type: "Earning-focused messages with instant appeal"
    },
    
    social_media: {
      platforms: ["LinkedIn (Medical professionals)", "Facebook (Healthcare groups)", "Instagram (Health influencers)"],
      target: "Medical professionals, Healthcare workers, Clinic owners",
      hashtags: "#HealthcareEarnings #DoctorIncome #MedicalProfessionals #HealthTech"
    },
    
    email_campaigns: {
      target: "Medical college databases, Hospital email lists, Healthcare conferences",
      frequency: "Weekly newsletters showing earning success stories"
    },
    
    medical_conferences: {
      events: "Medical conferences, Hospital meetings, Healthcare seminars",
      approach: "Live demos showing earning potential"
    },
    
    word_of_mouth: {
      strategy: "Existing doctors share with colleagues when they see earnings",
      multiplier: "Each earning doctor refers 3-5 colleagues monthly"
    }
  },

  // EXACT MARKETING MESSAGES
  messages: {
    doctor_whatsapp_groups: `🏥 *DOCTORS: EARN ₹500 per referral!*

💰 *Monthly Earning Potential: ₹15,000+*

✅ Refer 1 doctor = ₹500
✅ Refer 1 patient = ₹100  
✅ Instant bank transfer

👨‍⚕️ Join 500+ doctors already earning

*Download: HealthcarePro App*
*Referral Code: DOC500*`,

    linkedin_medical_professionals: `💰 Healthcare professionals earning ₹15,000+ monthly!

🎯 Join HealthcarePro:
• ₹500 per doctor referral
• ₹100 per patient referral
• AI-powered patient matching
• Instant payouts to bank

500+ doctors already earning. Join now!

#HealthcareEarnings #DoctorIncome #MedicalProfessionals`,

    email_to_doctors: `Subject: Earn ₹15,000+ monthly - Healthcare Platform

Dear Doctor,

Join HealthcarePro and start earning:

💰 ₹500 per doctor referral
💰 ₹100 per patient referral
💰 Monthly potential: ₹15,000+

✅ 500+ doctors already earning
✅ Instant bank transfers
✅ AI-powered patient matching

Join now with code: DOC500`,

    patient_social_media: `🏥 Revolutionary healthcare experience!

✨ AI-powered doctor matching
✨ Instant appointments
✨ Real-time updates
✨ Personalized health tips

500+ top doctors, 4.8⭐ rating

Healthcare made simple!

#HealthTech #AIHealthcare #SmartHealthcare`,

    patient_whatsapp: `🏥 *Found the BEST healthcare app!*

✅ AI finds perfect doctor for your symptoms
✅ Book appointments in 30 seconds
✅ Real-time queue updates
✅ 24/7 health recommendations

👨‍⚕️ 500+ verified doctors
⭐ 4.8/5 rating

*Download: HealthcarePro App*`
  },

  // MARKETING AUTOMATION
  automation: {
    trigger_points: [
      "When doctor earns first ₹500 - auto-generate sharing content",
      "Monthly earning reports - encourage more sharing",
      "New doctor joins - send referral links to existing doctors"
    ],
    
    viral_mechanics: [
      "Doctors share because they see real money",
      "Patients share because they get amazing service",
      "AI generates personalized content for each user",
      "Success stories create FOMO (Fear of Missing Out)"
    ]
  }
};

module.exports = marketingChannels;