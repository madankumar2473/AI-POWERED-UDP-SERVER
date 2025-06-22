import 'dotenv/config';
import { startUdpServer, createResponse, createTxtAnswer } from "denamed";
import { GoogleGenAI } from '@google/genai';

// const API_Key = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: "AIzaSyBpl_BEdb2xiztW-ILF7hWtSc75WeATnHs" });

startUdpServer(
  async (query) => {
    console.log(query);
    const question = query.questions[0];
    const prompt = `
      Answer the question in a one word sentence.
      Question: ${question.name.split('.').join(' ')}
    `;

    // Timeout helper
    function timeoutPromise(ms) {
      return new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms));
    }

    try {
      // Race AI call against a timeout (e.g., 2 seconds)
      const response = await Promise.race([
        ai.models.generateContent({
          model: "gemma-3-1b-it",
          contents: prompt
        }),
        timeoutPromise(2000)
      ]);
      const answer = response.candidates[0].content.parts[0].text;
      return createResponse(query, [createTxtAnswer(question, answer)]);
    } catch (err) {
      console.error('AI error:', err);
      return createResponse(query, [createTxtAnswer(question, "error")]);
    }
  },
  { port: 9000, host: "0.0.0.0" }
);

console.log("the server is runnning at port 8000");