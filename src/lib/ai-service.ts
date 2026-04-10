import OpenAI from 'openai';

const apiKey = 
  (typeof process !== 'undefined' ? process.env.VITE_OPENAI_API_KEY : undefined) || 
  import.meta.env.VITE_OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: apiKey || 'placeholder-key',
  dangerouslyAllowBrowser: true
});

export const transcribeAudio = async (audioFile: File) => {
  if (!apiKey || apiKey === 'placeholder-key') throw new Error("OpenAI API Key is not configured.");
  
  const transcription = await openai.audio.transcriptions.create({
    file: audioFile,
    model: "whisper-1",
    prompt: "This is a Nigerian trader speaking in English or Pidgin about sales and expenses.",
    language: "en"
  });
  return transcription.text;
};

export const processBusinessMessage = async (text: string) => {
  if (!apiKey || apiKey === 'placeholder-key') throw new Error("OpenAI API Key is not configured.");

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