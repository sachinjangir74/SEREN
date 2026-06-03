const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Service = require('../models/Service');
const Program = require('../models/Program');

// Load env vars
dotenv.config({ path: '../.env' }); // Adjust if needed

const services = [
  {
    title: 'Individual Therapy',
    slug: 'individual-therapy',
    category: 'therapy',
    shortDescription: 'One-on-one sessions tailored to your unique mental health needs.',
    fullDescription: 'Individual therapy provides a safe, confidential environment where you can work one-on-one with a licensed professional. Together, we explore your thoughts, feelings, and behaviors, and develop strategies tailored specifically to your goals and challenges.',
    benefits: [
      'Personalized treatment plans tailored to your specific needs',
      'A safe, non-judgmental space to explore complex emotions',
      'Develop effective coping strategies for daily life',
      'Gain deeper self-awareness and understanding'
    ],
    howItWorks: [
      { step: 1, title: 'Initial Assessment', description: 'We start by understanding your history, current challenges, and goals.' },
      { step: 2, title: 'Collaborative Planning', description: 'Together, we develop a customized treatment plan.' },
      { step: 3, title: 'Ongoing Sessions', description: 'Regular meetings to work through challenges and track progress.' }
    ],
    isActive: true
  },
  {
    title: 'Cognitive Behavioral Therapy (CBT)',
    slug: 'cognitive-behavioral-therapy',
    category: 'therapy',
    shortDescription: 'A structured, goal-oriented therapy to help manage problems by changing how you think and behave.',
    fullDescription: 'CBT is a highly effective, evidence-based approach that helps you identify and challenge negative thought patterns and behaviors. By understanding the connection between your thoughts, feelings, and actions, you can develop practical skills to overcome anxiety, depression, and other mental health challenges.',
    benefits: [
      'Learn practical skills to manage negative thoughts',
      'Identify and change harmful behavioral patterns',
      'Short-term, goal-oriented approach with measurable results',
      'Effective for anxiety, depression, and stress management'
    ],
    howItWorks: [
      { step: 1, title: 'Identify Patterns', description: 'Recognize negative thought patterns affecting your mood.' },
      { step: 2, title: 'Challenge Thoughts', description: 'Learn to question and reframe unhelpful beliefs.' },
      { step: 3, title: 'Behavioral Changes', description: 'Implement new, positive behaviors and coping strategies.' }
    ],
    isActive: true
  },
  {
    title: 'Psychiatric Evaluations',
    slug: 'psychiatric-evaluations',
    category: 'psychiatry',
    shortDescription: 'Comprehensive assessments to diagnose mental health conditions and formulate effective, personalized treatment plans.',
    fullDescription: 'Our psychiatric evaluations involve a thorough medical and psychological assessment conducted by licensed psychiatrists or nurse practitioners. This service is crucial for accurately diagnosing mental health conditions and determining if medication or specialized treatments are necessary as part of your comprehensive care plan.',
    benefits: [
      'Accurate diagnosis by medical professionals',
      'Exploration of medication management options',
      'Comprehensive understanding of biological and psychological factors',
      'Integrated care approach coordinating with your therapist'
    ],
    howItWorks: [
      { step: 1, title: 'Medical History', description: 'A detailed review of your medical and psychological background.' },
      { step: 2, title: 'Clinical Interview', description: 'An in-depth discussion about your current symptoms and experiences.' },
      { step: 3, title: 'Treatment Recommendation', description: 'A personalized plan which may include medication, therapy, or both.' }
    ],
    isActive: true
  },
  {
    title: 'Couples Counseling',
    slug: 'couples-counseling',
    category: 'couples',
    shortDescription: 'Improve communication, resolve conflicts, and strengthen your relationship with guided sessions.',
    fullDescription: 'Couples counseling helps partners in any stage of their relationship improve communication, resolve conflicts, and strengthen their emotional bond. Our experienced therapists provide a neutral, supportive environment for both individuals to be heard and understood.',
    benefits: [
      'Improve communication skills and intimacy',
      'Learn effective conflict resolution techniques',
      'Rebuild trust and emotional connection',
      'Navigate major life transitions together'
    ],
    howItWorks: [
      { step: 1, title: 'Joint Assessment', description: 'Understanding the relationship dynamics from both perspectives.' },
      { step: 2, title: 'Skill Building', description: 'Learning and practicing new communication and problem-solving tools.' },
      { step: 3, title: 'Relational Growth', description: 'Applying skills to deepen intimacy and overcome standing issues.' }
    ],
    isActive: true
  },
  {
    title: 'Mindfulness & Meditation',
    slug: 'mindfulness-and-meditation',
    category: 'counseling',
    shortDescription: 'Learn techniques to stay present, reduce stress, and improve overall mental well-being in your daily life.',
    fullDescription: 'Mindfulness and meditation practices teach you how to focus your attention on the present moment without judgment. This service provides guided instruction and practical techniques to help you reduce stress, improve concentration, and cultivate a sense of inner peace.',
    benefits: [
      'Reduce anxiety and stress levels',
      'Improve focus, concentration, and emotional regulation',
      'Enhance self-awareness and self-compassion',
      'Practical tools for daily life stress management'
    ],
    howItWorks: [
      { step: 1, title: 'Introduction to Basics', description: 'Learning fundamental mindfulness and breathing techniques.' },
      { step: 2, title: 'Guided Practice', description: 'Participating in structured meditation sessions.' },
      { step: 3, title: 'Daily Integration', description: 'Strategies for applying mindfulness in your everyday routines.' }
    ],
    isActive: true
  }
];

const programs = [
  {
    title: 'Managing Daily Stress',
    slug: 'managing-stress',
    description: 'A comprehensive 4-week program designed to equip you with practical tools to identify, understand, and effectively manage daily stressors. Through guided reflections and actionable strategies, you will build resilience and rediscover balance.',
    duration: '4 Weeks',
    category: 'Stress Management',
    benefits: [
      'Identify personal stress triggers',
      'Learn practical relaxation techniques',
      'Develop long-term resilience building habits',
      'Improve work-life balance and boundary setting'
    ],
    recommendedFor: 'Individuals feeling overwhelmed by daily responsibilities, experiencing burnout, or looking to improve their emotional resilience.',
    modules: [
      { title: 'Understanding Your Stress', description: 'Identify physical and emotional signs of stress and pinpoint your core triggers.', duration: 'Week 1', content: 'Module 1 Content: Stress is a normal physiological response, but chronic stress can be harmful. In this module, we will explore the "fight or flight" response and how it manifests in your life. You will begin a daily stress diary to track patterns over the next seven days.' },
      { title: 'The Power of Perspective', description: 'Learn cognitive reframing techniques to change how you perceive and react to stressful situations.', duration: 'Week 2', content: 'Module 2 Content: Our reaction to stress is often dictated by our interpretation of events. We will introduce cognitive behavioral techniques (CBT) to help you identify thought distortions (like catastrophizing) and practice reframing them into more balanced perspectives.' },
      { title: 'Actionable Relaxation Techniques', description: 'Master practical methods to calm your nervous system in the moment.', duration: 'Week 3', content: 'Module 3 Content: This week focuses on physiological regulation. We will practice square breathing, progressive muscle relaxation (PMR), and grounding exercises. You will integrate one technique into your daily routine.' },
      { title: 'Building Sustainable Resilience', description: 'Create a personalized stress management plan for long-term well-being.', duration: 'Week 4', content: 'Module 4 Content: Resilience is a muscle that can be strengthened. We will focus on lifestyle factors (sleep, nutrition, social support) and create a sustainable, personalized "Stress First-Aid Kit" for your future challenges.' }
    ],
    isActive: true
  },
  {
    title: 'Mindful Breathing 101',
    slug: 'mindful-breathing',
    description: 'An introductory 2-week course focused entirely on the power of breath. Learn fundamental breathing exercises that provide immediate relief from anxiety and help center your mind during chaotic moments.',
    duration: '2 Weeks',
    category: 'Mindfulness',
    benefits: [
      'Immediate tools for anxiety reduction',
      'Better sleep quality and relaxation',
      'Improved focus and mental clarity',
      'Easy techniques to use anywhere, anytime'
    ],
    recommendedFor: 'Beginners to mindfulness, individuals experiencing acute anxiety or panic, or those looking for quick relaxation tools.',
    modules: [
      { title: 'The Physiology of Breath', description: 'Understand how breathing directly impacts your nervous system and emotions.', duration: 'Week 1', content: 'Module 1 Content: Welcome to Mindful Breathing. In this module, you will learn the science behind why deep, diaphragmatic breathing calms the vagus nerve. We will practice the basic "belly breath" technique.' },
      { title: 'Advanced Breathing Techniques', description: 'Learn practical methods like 4-7-8 breathing and box breathing for specific situations.', duration: 'Week 2', content: 'Module 2 Content: Now that you understand the basics, we will introduce specialized techniques. The 4-7-8 method is excellent for sleep preparation, while box breathing (square breathing) is ideal for regaining focus during high-stress moments.' }
    ],
    isActive: true
  }
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/seren_db';
    console.log('Connecting to:', mongoUri);
    await mongoose.connect(mongoUri);

    const serviceCount = await Service.countDocuments();
    if (serviceCount > 0) {
      console.log('Services already exist in database, skipping seed to prevent data overwrite.');
    } else {
      console.log('Seeding Services...');
      await Service.insertMany(services);
    }

    const programCount = await Program.countDocuments();
    if (programCount > 0) {
      console.log('Programs already exist in database, skipping seed.');
    } else {
      console.log('Seeding Programs...');
      await Program.insertMany(programs);
    }

    console.log('Data successfully verified/seeded!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
