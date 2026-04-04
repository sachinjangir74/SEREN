const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Assessment = require('../models/Assessment');

dotenv.config();

const assessments = [
  {
    title: "Anxiety Assessment (GAD-7)",
    slug: "anxiety-assessment",
    description: "Generalized Anxiety Disorder assessment to understand your recent feelings of nervousness and worry.",
    questions: [
      { text: "Feeling nervous, anxious, or on edge?", options: [{ label: "Not at all", score: 0 }, { label: "Several days", score: 1 }, { label: "More than half the days", score: 2 }, { label: "Nearly every day", score: 3 }] },
      { text: "Not being able to stop or control worrying?", options: [{ label: "Not at all", score: 0 }, { label: "Several days", score: 1 }, { label: "More than half the days", score: 2 }, { label: "Nearly every day", score: 3 }] },
      { text: "Worrying too much about different things?", options: [{ label: "Not at all", score: 0 }, { label: "Several days", score: 1 }, { label: "More than half the days", score: 2 }, { label: "Nearly every day", score: 3 }] },
      { text: "Trouble relaxing?", options: [{ label: "Not at all", score: 0 }, { label: "Several days", score: 1 }, { label: "More than half the days", score: 2 }, { label: "Nearly every day", score: 3 }] },
      { text: "Being so restless that it is hard to sit still?", options: [{ label: "Not at all", score: 0 }, { label: "Several days", score: 1 }, { label: "More than half the days", score: 2 }, { label: "Nearly every day", score: 3 }] },
      { text: "Becoming easily annoyed or irritable?", options: [{ label: "Not at all", score: 0 }, { label: "Several days", score: 1 }, { label: "More than half the days", score: 2 }, { label: "Nearly every day", score: 3 }] },
      { text: "Feeling afraid, as if something awful might happen?", options: [{ label: "Not at all", score: 0 }, { label: "Several days", score: 1 }, { label: "More than half the days", score: 2 }, { label: "Nearly every day", score: 3 }] }
    ],
    scoreThresholds: [
      { minScore: 0, maxScore: 4, severity: "Minimal Anxiety", recommendation: "Your anxiety levels are minimal. Continue practicing mindfulness.", suggestedProgramSlug: "mindful-breathing" },
      { minScore: 5, maxScore: 9, severity: "Mild Anxiety", recommendation: "You are experiencing mild anxiety. Our Anxiety Relief program could help.", suggestedProgramSlug: "anxiety-relief" },
      { minScore: 10, maxScore: 14, severity: "Moderate Anxiety", recommendation: "You have moderate anxiety. We recommend a consultation with a therapist.", suggestedProgramSlug: "one-to-one-therapy" },
      { minScore: 15, maxScore: 21, severity: "Severe Anxiety", recommendation: "You are experiencing severe anxiety. Please book a clinical session immediately.", suggestedProgramSlug: "one-to-one-therapy" }
    ]
  },
  {
    title: "Depression Assessment (PHQ-9)",
    slug: "depression-assessment",
    description: "Patient Health Questionnaire to monitor the severity of depression and response to treatment.",
    questions: [
      { text: "Little interest or pleasure in doing things?", options: [{ label: "Not at all", score: 0 }, { label: "Several days", score: 1 }, { label: "More than half the days", score: 2 }, { label: "Nearly every day", score: 3 }] },
      { text: "Feeling down, depressed, or hopeless?", options: [{ label: "Not at all", score: 0 }, { label: "Several days", score: 1 }, { label: "More than half the days", score: 2 }, { label: "Nearly every day", score: 3 }] },
      { text: "Trouble falling or staying asleep, or sleeping too much?", options: [{ label: "Not at all", score: 0 }, { label: "Several days", score: 1 }, { label: "More than half the days", score: 2 }, { label: "Nearly every day", score: 3 }] },
      { text: "Feeling tired or having little energy?", options: [{ label: "Not at all", score: 0 }, { label: "Several days", score: 1 }, { label: "More than half the days", score: 2 }, { label: "Nearly every day", score: 3 }] },
      { text: "Poor appetite or overeating?", options: [{ label: "Not at all", score: 0 }, { label: "Several days", score: 1 }, { label: "More than half the days", score: 2 }, { label: "Nearly every day", score: 3 }] }
    ],
    scoreThresholds: [
      { minScore: 0, maxScore: 4, severity: "Minimal Depression", recommendation: "You're doing okay! Maintain a healthy routine.", suggestedProgramSlug: "happiness-program" },
      { minScore: 5, maxScore: 14, severity: "Mild to Moderate", recommendation: "Consider our happiness program to boost your mood.", suggestedProgramSlug: "happiness-program" },
      { minScore: 15, maxScore: 27, severity: "Severe Depression", recommendation: "Please reach out to a therapist for support.", suggestedProgramSlug: "one-to-one-therapy" }
    ]
  }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB for seeding...");
        
        await Assessment.deleteMany({});
        console.log("Cleared existing assessments.");
        
        await Assessment.insertMany(assessments);
        console.log("Seeded assessments successfully!");
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
