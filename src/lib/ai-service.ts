import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for MVP/Demo purposes
});

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
    
    Message: "${text}"
    
    Return ONLY a JSON object:
    {
      "item": string,
      "qty": number,
      "unit_price": number,
      "total": number,
      "currency": "NGN" | "USD" | "GBP",
      "type": "sale" | "expense"
    }
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content || '{}');
};