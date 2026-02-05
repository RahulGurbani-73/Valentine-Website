
import { GoogleGenAI, Type } from "@google/genai";

export async function generateRomanticMessages() {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate a list of 15 romantic items for a Valentine's celebration. 3 should be 'highlights' (slightly longer, deeply meaningful reasons why someone is loved) and 12 should be 'notes' (short, sweet one-liners). Return as a structured JSON object.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            highlights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Deep romantic reasons.",
            },
            notes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Short sweet notes.",
            }
          },
          required: ["highlights", "notes"]
        },
        temperature: 0.9,
      },
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as { highlights: string[], notes: string[] };
  } catch (error) {
    console.error("Error generating messages:", error);
    return {
      highlights: [
        "You are my anchor in every storm and my light in every dark night.",
        "Your kindness is the most beautiful thing I have ever known.",
        "I love how we can talk for hours or sit in perfect silence together."
      ],
      notes: [
        "You make my heart skip a beat!",
        "My favorite place is inside your hug.",
        "Every day with you is a gift.",
        "You are my sunshine.",
        "I'm so lucky to have you.",
        "You complete me.",
        "Forever isn't long enough.",
        "The best thing that ever happened to me.",
        "My heart belongs to you.",
        "Life is beautiful with you.",
        "You are my soulmate.",
        "Love you to the moon and back."
      ]
    };
  }
}

export async function generatePoem() {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Write a short, beautiful 4-line romantic poem for a Valentine. Keep it classic and sweet.",
      config: {
        temperature: 1.0,
      },
    });
    return response.text.trim();
  } catch (e) {
    return "In every breath and every beat,\nYou make my world feel so complete.\nA love as pure as morning dew,\nMy heart will always belong to you.";
  }
}

export async function generateSecret() {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate a sweet 'secret' about why I love my partner. Something cute like 'I secretly love the way you wrinkle your nose when you laugh'. One sentence only.",
      config: {
        temperature: 1.1,
      },
    });
    return response.text.trim();
  } catch (e) {
    return "I secretly think you have the most beautiful soul I've ever encountered.";
  }
}
