const { GoogleGenAI } = require("@google/genai");

let ai;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({});
  }
} catch (e) {

}

// 1. Companion Chatbot Controller
exports.getChatCompanionResponse = async (req, res) => {
  try {
    const { message, history } = req.body;
    
    // Use Real Gemini AI if Key is Present
    if (ai) {
      const systemInstruction = "You are Seren, a compassionate and empathetic AI mental health companion. Your role is to provide a safe space for users to express their feelings, offer grounding exercises, and suggest professional help when appropriate. You do NOT provide medical diagnoses. Keep replies concise, warm, and conversational.";

      let chatContents = "";
      if (history && history.length > 0) {
        chatContents = history.map((m) => m.senderType === 'user' ? `User: ${m.message}` : `Seren: ${m.message}`).join("\n");
        chatContents += `\nUser: ${message}`;
      } else {
        chatContents = message;
      }

      const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: chatContents,
          config: {
              systemInstruction,
              temperature: 0.7
          }
      });

      return res.status(200).json({ reply: response.text });
    } 
    
    // Otherwise fallback to intelligent mock
    const lowerMsg = message.toLowerCase();
    let reply = "I hear you. Could you tell me more about how that makes you feel?";
    
    if (lowerMsg.includes('sad') || lowerMsg.includes('depressed')) {
      reply = "I'm so sorry you're feeling this way. It takes courage to share that. Remember that it's okay to feel sad sometimes.";
    } else if (lowerMsg.includes('anxious') || lowerMsg.includes('anxiety')) {
      reply = "Anxiety can be really overwhelming. Let's try to take a deep breath together. What usually helps ground you?";
    } else if (lowerMsg.includes('thank')) {
      reply = "You're very welcome. I'm here for you whenever you need to talk.";
    }

    setTimeout(() => {
      res.status(200).json({ reply });
    }, 1500);

  } catch (error) {
    console.error("AI Companion Error:", error);
    res.status(500).json({ message: "Failed to generate AI response", error: error.message });
  }
};

// 2. Session Summarizer Controller
exports.summarizeSession = async (req, res) => {
  try {
    const { sessionTranscript } = req.body;

    if (!ai) {
      return res.status(503).json({
        summary: "AI service is currently unavailable.",
      });
    }

    const prompt = `As a clinical assistant, summarize the following therapy session transcript into 3 sections: 1) Key Topics Discussed, 2) Core Emotions Identified, 3) Suggested Next Steps/Homework. Keep it strictly professional.\n\nTranscript:\n${sessionTranscript}`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            temperature: 0.2 // Lower temp for more factual summaries
        }
    });

    res.status(200).json({
      summary: response.text,
    });
  } catch (error) {
    console.error("AI Summary Error:", error);
    res.status(500).json({ message: "Failed to summarize session", error: error.message });
  }
};

const User = require('../models/User');
const Mood = require('../models/Mood');

exports.getDashboardInsights = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const moods = await Mood.find({ user: userId }).sort({ createdAt: -1 }).limit(7);
    
    // 1. Gamification (Streak logic)
    const today = new Date();
    today.setHours(0,0,0,0);
    let streak = user.gamification?.currentStreak || 0;
    
    // Simple mock logic for MVP: just use gamification if it's there
    if (!user.gamification) {
      user.gamification = { currentStreak: 0, longestStreak: 0, badges: [] };
    }

    // 2. Mood Prediction & Trends
    let averageStress = 0;
    let prediction = "Stable. Keep up your routine!";
    let recommendedAction = { title: "Relaxation", link: "/resources", desc: "Enjoy some free time." };
    
    if (moods.length > 0) {
      let recentStress = moods.reduce((acc, curr) => acc + (curr.stress || Math.max(1, 10 - (curr.mood || 5))), 0) / moods.length;
      
      if (recentStress > 7) {
        prediction = "Potential burnout detected based on recent elevated stress levels.";
        recommendedAction = { title: "Talk to a Therapist", link: "/services/one-to-one-therapy", desc: "Professional help is advised." };
      } else if (recentStress > 4) {
        prediction = "You might feel a bit overwhelmed soon.";
        recommendedAction = { title: "Mindfulness Program", link: "/programs/mindful-breathing", desc: "Try a quick breathing exercise." };
      } else {
        prediction = "Your mood is trending positively!";
      }
    } else {
       prediction = "Not enough data yet. Log your mood to see predictions.";
    }

    // 3. User Journey Plan
    const journey = {
      step1: { title: "Take Assessment", completed: user.assessmentResults?.length > 0 },
      step2: { title: "Start a Program", completed: user.enrolledPrograms?.length > 0 },
      step3: { title: "Talk to a Professional", completed: false } // Mock
    };

    res.json({
      success: true,
      data: {
        gamification: user.gamification,
        prediction,
        recommendedAction,
        journey
      }
    });

  } catch (error) {
    console.error("Dashboard Insights Error:", error);
    res.status(500).json({ message: "Failed to generate insights", error: error.message });
  }
};
