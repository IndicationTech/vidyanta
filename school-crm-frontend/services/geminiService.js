import { GoogleGenAI } from "@google/genai";

// Guideline: Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
// Obtain the key exclusively from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTimetable = async (teachers, classes) => {
  const prompt = `Generate a weekly school timetable for the following classes: ${classes.join(
    ", "
  )}. 
  Available Teachers and their subjects: ${JSON.stringify(teachers)}.
  Rules: 
  1. 8 periods per day.
  2. 5 days a week (Mon-Fri).
  3. No teacher should have overlapping classes.
  4. Include lunch break.
  Return the result as a JSON object representing the schedule.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });
    // Guideline: Use .text property (not a method) to extract output string.
    const text = response.text || "{}";
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Timetable generation failed:", error);
    return null;
  }
};

export const analyzePerformance = async (studentData) => {
  const prompt = `Analyze this student performance data: ${JSON.stringify(
    studentData
  )}. 
  Provide a short summary of strengths, weaknesses, and 3 actionable improvement steps.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    // Guideline: Access generated content via .text property.
    return response.text || "No analysis available.";
  } catch (error) {
    console.error("Performance analysis failed:", error);
    return "Failed to analyze performance.";
  }
};

export const generateAnnouncement = async (topic, role) => {
  const prompt = `Write a professional school announcement for ${role} regarding: ${topic}. Keep it concise and informative.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    // Guideline: Access generated content via .text property.
    return response.text || "No announcement generated.";
  } catch (error) {
    console.error("Announcement generation failed:", error);
    return "Error generating announcement.";
  }
};
