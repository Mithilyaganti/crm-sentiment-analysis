import { GoogleGenerativeAI } from "@google/generative-ai";
import env from "./env";

const apiKey = env.GOOGLE_API_KEY;
if (!apiKey) throw new Error("Google API Key is required");

const ai = new GoogleGenerativeAI(apiKey);

const model = ai.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: { responseMimeType: "application/json" },
});

const respond = async (
  feedback: string
): Promise<{
  success: boolean;
  sentimentScore?: number;
  overview?: string;
}> => {
  const sentimentPrompt = `
    You are an advanced AI sentiment analysis expert. Analyze the following feedback text and provide:
    1. A sentiment score from 0 (very bad), 1 (bad), 2 (average), 3 (good).
    2. What the user specifically likes or dislikes in the feedback. If positive, describe what they liked. If negative, describe what they disliked.
    Respond in the following JSON format:
    {
      "sentiment_score": <0 | 1 | 2 | 3>,
      "overview": "Description of what the user likes or dislikes or neutral",
    }
    
    Here is the user feedback: "${feedback}"
  `;

  try {
    const result = await model.generateContent(sentimentPrompt);
    const responseJson = JSON.parse(result.response.text());

    return {
      success: true,
      sentimentScore: responseJson.sentiment_score,
      overview: responseJson.overview,
    };
  } catch (error) {
    console.error("Error in AI sentiment analysis:", error);
    return {
      success: false,
      sentimentScore: undefined,
      overview: "unknown",
    };
  }
};

export { respond };
