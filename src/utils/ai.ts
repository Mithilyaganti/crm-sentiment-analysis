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

const imageGenerationPrompt = async (prompt: string) => {
  const imagePrompt = `
    You are an expert prompt engineer specializing in crafting highly detailed prompts for generating visually appealing social media posts. 
    The user's request is for a social media post that aligns with a business, and you need to enhance the provided prompt with creative elements, visual details, and proper tone. 

    Here is the user's input: "${prompt}"

    Respond in the following JSON format:
    {
      "prompt": [YOUR PROPT]
    }

    Based on this, generate an optimized prompt for creating a high-quality image that reflects the" business's branding and message", ensuring the final result is visually engaging and tailored for a social media post.
    The image shall contain brading and tagline of the business.
    generate the prompt for the business social media post generation in 30-40 words 
  `;
  try {
    const result = await model.generateContent(imagePrompt);
    const responseJson = JSON.parse(result.response.text());

    return {
      success: true,
      prompt: responseJson.prompt,
    };
  } catch (error) {
    console.error("Error in AI image generation:", error);
    return {
      success: false,
      prompt: prompt,
    };
  }
};

export { respond, imageGenerationPrompt };
