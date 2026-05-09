// src/lib/ai-service.ts
import OpenAI from "openai";

// Ensure you have VITE_OPENAI_API_KEY in your .env file
const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

export async function generateAIResponse(prompt: string): Promise<string> {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0]?.message?.content ?? "No response generated.";
  } catch (err: any) {
    console.error("AI Service Error:", err);
    return "Sorry, I couldn’t generate a response.";
  }
}
