import OpenAI from 'openai';
import axios from 'axios';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

/**
 * Transcribes audio using OpenAI Whisper
 * Optimized for Nigerian English and Pidgin
 */
export const transcribeAudio = async (audioFile: File) => {
  const transcription = await openai.audio.transcriptions.create({
    file: audioFile,
    model: "whisper-1",
    prompt: "This is a Nigerian trader speaking in English or Pidgin about sales and expenses. Examples: 'I sell 5 bags of rice', 'I buy fuel for 2k'.",
    language: "en"
  });
  return transcription.text;
};

/**
 * Processes text to extract structured transaction data
 */
export const processBusinessMessage = async (text: string) => {
  const prompt = `
    You are a financial assistant for Nigerian traders. 
    Extract transaction data from the following message.
    
    Rules:
    - "5k" = 5000, "2.5k" = 2500, "1 box" = 100000 (if context implies high value)
    - "I sell" or "Sold" = sale
    - "I buy", "Spent", "Paid for" = expense
    - Recognize ₦, $, £. Default to NGN.
    - Understand Pidgin: "I don sell 5 bags of rice" -> sale, item: rice, qty: 5.
    - If the user says "My business name is [Name]", return a special object: {"type": "profile_update", "business_name": "[Name]"}
    
    Message: "${text}"
    
    Return ONLY a JSON object:
    {
      "item": string,
      "qty": number,
      "unit_price": number,
      "total": number,
      "currency": "NGN" | "USD" | "GBP",
      "type": "sale" | "expense" | "profile_update",
      "business_name": string (only if type is profile_update)
    }
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content || '{}');
};