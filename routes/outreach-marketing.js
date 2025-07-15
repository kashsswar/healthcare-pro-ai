const express = require('express');
const router = express.Router();

// AI Outreach Marketing - Reaches potential users
router.get('/generate-outreach-content', async (req, res) => {
  try {
    const { platform, target } = req.query; // 'social', 'email', 'sms' | 'patient', 'doctor'
    
    const patientContent = {
      social: [
        "🏥 Tired of waiting hours for doctor appointments? HealthConnect AI connects you with verified doctors instantly. No queues, no hassle. Try it free!",
        "💊 Finding the right doctor shouldn't be complicated. Our AI matches you with specialists based on your symptoms. Healthcare made simple.",
        "⏰ Book doctor appointments in 2 minutes, not 2 hours. Join thousands who've switched to smart healthcare."
      ],
      email: {
        subject: "Skip the waiting room - Book doctors online",
        body: "Hi there!\n\nTired of long waits at clinics? HealthConnect AI lets you:\n✅ Find verified doctors instantly\n✅ Book appointments that fit your schedule\n✅ Get AI-powered health recommendations\n\nNo more wasted time in waiting rooms. Try it today!\n\nHealthConnect AI Team"
      },
      sms: "🏥 Skip clinic queues! Book verified doctors online in 2 minutes. HealthConnect AI - Healthcare made simple. Try free: [link]"
    };

    const doctorContent = {
      social: [
        "👨‍⚕️ Doctors: Expand your practice online! Reach more patients, manage appointments efficiently, and grow your income with HealthConnect AI.",
        "🩺 Join 100+ doctors already serving patients online. Flexible scheduling, verified patient base, secure consultations.",
        "💼 Modern healthcare needs modern solutions. Join HealthConnect AI and connect with patients who need your expertise."
      ],
      email: {
        subject: "Grow your practice with online consultations",
        body: "Dear Doctor,\n\nExpand your reach beyond your clinic walls. HealthConnect AI helps you:\n✅ Connect with more patients\n✅ Manage appointments efficiently\n✅ Provide consultations on your schedule\n\nJoin our growing network of healthcare professionals.\n\nBest regards,\nHealthConnect AI Team"
      },
      sms: "👨‍⚕️ Dr., expand your practice online! Connect with more patients through HealthConnect AI. Join our medical network: [link]"
    };

    const content = target === 'doctor' ? doctorContent : patientContent;
    res.json({ content: content[platform] });
  } catch (error) {
    res.status(500).json({ error: 'Content generation failed' });
  }
});

// Generate authentic health awareness posts
router.get('/health-awareness', async (req, res) => {
  const healthPosts = [
    {
      topic: "Heart Health",
      content: "❤️ Heart disease is preventable in 80% of cases. Regular checkups can detect issues early. When did you last check your heart health?",
      cta: "Find a cardiologist near you"
    },
    {
      topic: "Diabetes Prevention", 
      content: "🍎 Pre-diabetes affects 1 in 3 adults. Simple lifestyle changes can prevent Type 2 diabetes. Get screened today.",
      cta: "Consult an endocrinologist"
    },
    {
      topic: "Mental Health",
      content: "🧠 1 in 4 people experience mental health issues. It's okay to seek help. Professional support makes a difference.",
      cta: "Talk to a psychiatrist"
    },
    {
      topic: "Women's Health",
      content: "👩‍⚕️ Regular gynecological checkups can prevent 90% of cervical cancers. Your health matters - don't delay screenings.",
      cta: "Book gynecologist appointment"
    }
  ];

  const randomPost = healthPosts[Math.floor(Math.random() * healthPosts.length)];
  res.json(randomPost);
});

// Generate problem-solution posts
router.get('/problem-solution', async (req, res) => {
  const problems = [
    {
      problem: "Spent 3 hours at clinic, saw doctor for 5 minutes",
      solution: "Book online consultations - same quality care, zero waiting time",
      audience: "patients"
    },
    {
      problem: "Can't find specialists in your area?",
      solution: "Access 500+ verified doctors across 20+ specializations online",
      audience: "patients"
    },
    {
      problem: "Clinic hours don't match your schedule?",
      solution: "Doctors available 24/7 for online consultations",
      audience: "patients"
    },
    {
      problem: "Want to expand your patient base beyond your locality?",
      solution: "Reach patients across the country through online consultations",
      audience: "doctors"
    }
  ];

  const randomProblem = problems[Math.floor(Math.random() * problems.length)];
  res.json(randomProblem);
});

module.exports = router;