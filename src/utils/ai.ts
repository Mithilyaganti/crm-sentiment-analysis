import { GoogleGenerativeAI } from "@google/generative-ai";
import env from "./env";
const apiKey = env.GOOGLE_API_KEY;
if(!apiKey)
    throw new Error("Google API Key is required");

const ai = new GoogleGenerativeAI(apiKey);

const model = ai.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const respond = async (
  prompt: string
): Promise<{
  success: boolean;
  response: string;
}> => {
  try {
    const result = await model.generateContent(prompt);
    return { success: true, response: result.response.text() };
  } catch (error) {
    console.log(error);
    return { success: false, response: "An error occurred" };
  }
};

export { respond };
