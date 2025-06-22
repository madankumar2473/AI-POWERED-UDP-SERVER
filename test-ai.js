import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

// const API_Key = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: "AIzaSyBpl_BEdb2xiztW-ILF7hWtSc75WeATnHs" });

async function test() {
  try {
    const response = await ai.models.generateContent({
      model: "gemma-3-1b-it", // or another valid model
      contents: "Say hello"
    });
    const answer = response.candidates[0].content.parts[0].text;
    console.log(answer);
  } catch (err) {
    console.error('AI error:', err);
  }
}

test(); 