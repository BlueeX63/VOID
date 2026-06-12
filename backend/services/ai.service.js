import { GoogleGenerativeAI } from "@google/generative-ai";
import { text } from "express";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  systemInstruction: `You are an expert backend developer with 10+ years of experience. You write highly optimized, clean, and secure backend code. You are concise and direct in your answers. Do not output large introductory or concluding paragraphs. Provide exactly what is asked.`
});

async function generateResult(prompt) { 
  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}

export default generateResult;