import OpenAI from "openai";
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

export async function transcribeAudio(file: File): Promise<string> {
  try {
    const response = await client.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
    });
    return response.text;
  } catch (err) {
    console.error("Transcription Error:", err);
    throw new Error("Failed to transcribe audio");
  }
}

export async function processBusinessMessage(text: string) {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a business assistant for a Nigerian trader. Extract transaction details from the message. 
          Return a JSON object with:
          - type: 'sale' or 'expense' or 'profile_update'
          - item: string (the item name)
          - qty: number (default 1)
          - total: number (the total amount in Naira)
          - business_name: string (only if type is profile_update)
          
          If the user says something like "My business name is X", type is 'profile_update'.
          If the user records a sale or expense, extract the details.
          Example: "I sold 2 bags of rice for 15k each" -> { type: 'sale', item: 'Rice', qty: 2, total: 30000 }
          Example: "Bought fuel for 5000" -> { type: 'expense', item: 'Fuel', qty: 1, total: 5000 }`
        },
        { role: "user", content: text }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No content from AI");
    return JSON.parse(content);
  } catch (err) {
    console.error("Processing Error:", err);
    throw new Error("Failed to process message");
  }
}
