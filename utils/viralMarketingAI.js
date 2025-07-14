const OpenAI = require('openai');
const Doctor = require('../models/Doctor');
const Incentive = require('../models/Incentive');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

class ViralMarketingAI {
  static async generatePersonalizedContent(user, doctor, contentType) {
    const prompt = `Generate ${contentType} content for healthcare platform:
    Doctor: ${doctor.specialization}, Rating: ${doctor.finalRating}/5, Fee: ₹${doctor.consultationFee}
    User: ${user.type}
    Make it compelling, show clear benefits, include profit incentives.
    Keep it under 150 words, professional tone.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200
    });

    return response.choices[0].message.content;
  }

  static async calculateIncentives(userId, action, data) {
    let incentive = await Incentive.findOne({ userId }) || new Incentive({ userId, type: data.userType });
    
    if (data.userType === 'doctor') {
      switch(action) {
        case 'referral':
          incentive.earnings.referralBonus += 500;
          incentive.referrals.push({ referredUserId: data.referredId, bonus: 500 });
          break;
        case 'patient_referral':
          incentive.earnings.referralBonus += 100;
          incentive.referrals.push({ referredUserId: data.referredId, bonus: 100 });
          break;
      }
      incentive.earnings.totalEarned = incentive.earnings.referralBonus + incentive.earnings.shareBonus;
    }
    
    await incentive.save();
    return incentive;
  }

  static async generateViralCampaign(doctorId) {
    const doctor = await Doctor.findById(doctorId).populate('userId');
    
    const campaigns = {
      // For Doctors - Earning focused
      doctor_whatsapp: `🏥 *DOCTORS: EARN ₹500 per referral!*\n\n💰 *Monthly Earning Potential: ₹15,000+*\n\n✅ Refer 1 doctor = ₹500\n✅ Refer 1 patient = ₹100\n✅ Instant bank transfer\n\n👨‍⚕️ Join 500+ doctors already earning\n\n*Download: HealthcarePro App*\n*Referral Code: DOC500*`,
      
      doctor_social: `💰 Healthcare professionals earning ₹15,000+ monthly!\n\n🎯 Join HealthcarePro:\n• ₹500 per doctor referral\n• ₹100 per patient referral\n• AI-powered patient matching\n• Instant payouts to bank\n\n500+ doctors already earning. Join now!\n\n#HealthcareEarnings #DoctorIncome #MedicalProfessionals`,
      
      // For Patients - Value focused (no money incentives)
      patient_whatsapp: `🏥 *Found the BEST healthcare app!*\n\n✅ AI finds perfect doctor for your symptoms\n✅ Book appointments in 30 seconds\n✅ Real-time queue updates\n✅ 24/7 health recommendations\n\n👨‍⚕️ 500+ verified doctors\n⭐ 4.8/5 rating\n\n*Download: HealthcarePro App*`,
      
      patient_social: `🏥 Revolutionary healthcare experience!\n\n✨ AI-powered doctor matching\n✨ Instant appointments\n✨ Real-time updates\n✨ Personalized health tips\n\n500+ top doctors, 4.8★ rating\n\nHealthcare made simple!\n\n#HealthTech #AIHealthcare #SmartHealthcare`,
      
      email_doctor: {
        subject: `Earn ₹15,000+ monthly - Healthcare Platform`,
        body: `Dear Dr. ${doctor.userId.name},\n\nJoin HealthcarePro and start earning:\n\n💰 ₹500 per doctor referral\n💰 ₹100 per patient referral\n💰 Monthly potential: ₹15,000+\n\n✅ 500+ doctors already earning\n✅ Instant bank transfers\n✅ AI-powered patient matching\n\nJoin now with code: DOC500`
      },
      
      email_patient: {
        subject: `AI Healthcare Revolution - Find Perfect Doctors Instantly`,
        body: `Dear Patient,\n\nExperience next-gen healthcare:\n\n🤖 AI finds perfect doctor for your symptoms\n⚡ Book appointments in 30 seconds\n📱 Real-time queue updates\n💡 24/7 personalized health tips\n\n500+ verified doctors, 4.8★ rating\n\nDownload HealthcarePro App today!`
      }
    };

    return campaigns;
  }
}

module.exports = ViralMarketingAI;