import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

console.log("✅ GEMINI KEY LOADED:", !!process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const model = genAI.getGenerativeModel({
      model: "models/gemini-1.5-flash",
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
    });

    const reply = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.status(500).json({
        error: "Empty response from Gemini",
      });
    }

    res.json({ reply });
  } catch (error) {
    console.error("🔥 GEMINI 2.5 ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/generate-announcement", async (req, res) => {
  try {
    const { topic, role } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const prompt = `You are an AI Communication Assistant for a School CRM. Generate a fully functional school announcement draft based on the given topic.

Topic: ${topic}
Audience: ${role || "Parents and Students"}

Rules:
1) Output must be clear, formal, and school-friendly.
2) Include all required details in a structured format.
3) If details are missing, make realistic assumptions but keep them generic.
4) Keep it short, actionable, and easy to read.

Return the announcement in this format exactly:

TITLE:
(1 short line title)

MESSAGE:
(5–10 lines, easy language, bullet points allowed)

IMPORTANT DETAILS:
- Date:
- Time:
- Location:
- Applicable For:
- Instructions:

CLOSING:
(1–2 lines)

SIGNATURE:
Principal / School Admin`;

    const model = genAI.getGenerativeModel({
      model: "models/gemini-1.5-flash",
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const reply = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.status(500).json({
        error: "Empty response from Gemini",
      });
    }

    res.json({ reply });
  } catch (error) {
    console.error("🔥 GEMINI ANNOUNCEMENT GENERATION ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
