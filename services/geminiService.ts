import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { EXPERIENCE_DATA, PROJECTS_DATA, SKILLS_DATA } from "../constants";

// Construct a context string from the portfolio data
const PORTFOLIO_CONTEXT = `
You are an AI assistant for Arnav Raju Penumetcha's portfolio website. 
Your goal is to answer questions about Arnav's experience, skills, and projects in a professional, friendly, and concise manner.

Here is Arnav's data:

Experience:
${JSON.stringify(EXPERIENCE_DATA)}

Projects:
${JSON.stringify(PROJECTS_DATA)}

Skills:
${JSON.stringify(SKILLS_DATA)}

System Instructions:
1. Only answer questions related to Arnav's professional life, skills, and projects.
2. If asked about personal private details, politely decline.
3. Keep answers brief (under 100 words) unless asked for details.
4. Be enthusiastic about his AI and Full Stack capabilities.
5. If the user greets you, greet them back as Arnav's digital assistant.
`;

let client: GoogleGenAI | null = null;

const getClient = () => {
  if (!client) {
    if (!process.env.API_KEY) {
      console.warn("API_KEY not found in environment variables.");
      return null;
    }
    client = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return client;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  const ai = getClient();
  if (!ai) {
    return "I'm currently offline (API Key missing). Please contact Arnav directly via email!";
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: PORTFOLIO_CONTEXT,
      }
    });
    
    return response.text || "I didn't catch that. Could you rephrase?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered a temporary error. Please try again later.";
  }
};

export const roastResume = async (resumeText: string): Promise<string> => {
  const ai = getClient();
  if (!ai) {
    return "I need an API key to roast you properly. Add it to the environment!";
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Here is a resume:\n${resumeText}\n\nRoast this resume. Be funny, slightly mean, but constructive if possible. Focus on formatting, buzzwords, generic phrases, or lack of substance. Act like a hardened tech recruiter who has seen it all. Keep it under 150 words.`,
    });
    return response.text || "This resume is so blank I can't even roast it.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I tried to roast you, but the server overheated. Try again.";
  }
};
