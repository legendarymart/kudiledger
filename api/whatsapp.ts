// api/whatsapp.js
import type { VercelRequest, VercelResponse } from "@vercel/node";
import supabase from "../src/lib/supabase.js";
import { generateAIResponse } from "../src/lib/ai-service.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { message, userId } = req.body;

    if (!message || !userId) {
      return res.status(400).json({ error: "Missing message or userId" });
    }

    // Example: store incoming WhatsApp message in Supabase
    const { error } = await supabase
      .from("messages")
      .insert([{ user_id: userId, content: message }]);

    if (error) {
      throw error;
    }

    // Generate AI response using OpenAI
    const aiReply = await generateAIResponse(message);

    return res.status(200).json({ reply: aiReply });
  } catch (err: any) {
    console.error("Error in WhatsApp API:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
