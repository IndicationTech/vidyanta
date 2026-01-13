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

export default router;
