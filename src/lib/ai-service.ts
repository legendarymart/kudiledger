import OpenAI from 'openai';

// Using the provided key as a fallback if the environment variable is not set
const apiKey = 
  import.meta.env.VITE_OPENAI_API_KEY || 
  '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';

const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true
});

export const transcribeAudio = async (audioFile: File) => {
  const transcription = await openai.audio.transcriptions.create({
    file: audioFile,
    model: "whisper-1",
    prompt: "This is a Nigerian trader speaking in English or Pidgin about sales and expenses.",
    language: "en"
  });
  return transcription.text;
};

export const processBusinessMessage = async (text: string) => {
  const prompt = `
    Extract transaction data from: "${text}"
    Rules: "5k" = 5000. "I sell" = sale, "I buy" = expense. Default NGN.
    If user says "My business name is [Name]", type: "profile_update".
    Return ONLY JSON: {item, qty, total, currency, type, business_name}
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content || '{}');
};