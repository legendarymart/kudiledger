import { supabase } from "./supabase";
import { processBusinessMessage, transcribeAudio } from "./ai-service";
import axios from "axios";

/**
 * WHATSAPP WEBHOOK HANDLER
 */

// 1. VERIFICATION (GET)
export const verifyWebhook = (req: Request) => {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === import.meta.env.VITE_WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
};

// 2. MESSAGE HANDLING (POST)
export const handleWhatsAppMessage = async (body: any) => {
  const entry = body.entry?.[0];
  const changes = entry?.changes?.[0];
  const value = changes?.value;
  const message = value?.messages?.[0];

  if (!message) return new Response("No message", { status: 200 });

  const from = message.from;
  const type = message.type;

  // --- IMMEDIATE FEEDBACK ---
  // We send a "Processing" message immediately so the user knows we're working
  // and Meta doesn't timeout the webhook request.
  await sendWhatsAppReply(from, "⏳ Processing your request... please wait.");

  try {
    let text = "";

    // A. Handle Audio
    if (type === "audio") {
      const audioId = message.audio.id;
      const mediaRes = await axios.get(
        `https://graph.facebook.com/v17.0/${audioId}`,
        { headers: { Authorization: `Bearer ${import.meta.env.WHATSAPP_ACCESS_TOKEN}` } }
      );
      
      const audioDownload = await axios.get(mediaRes.data.url, {
        headers: { Authorization: `Bearer ${import.meta.env.WHATSAPP_ACCESS_TOKEN}` },
        responseType: 'arraybuffer'
      });

      const audioFile = new File([audioDownload.data], "voice.ogg", { type: "audio/ogg" });
      text = await transcribeAudio(audioFile);
    } 
    // B. Handle Text
    else if (type === "text") {
      text = message.text.body;
    }

    if (!text) return new Response("Empty", { status: 200 });

    // 3. Database Logic
    let { data: profile } = await supabase.from('profiles').select('*').eq('phone_number', from).single();

    if (!profile) {
      const { data: newProfile } = await supabase.from('profiles').insert([{ phone_number: from }]).select().single();
      profile = newProfile;
    }

    // 4. Gatekeeper
    if (!profile?.is_subscribed && (profile?.trial_count || 0) >= 10) {
      await sendWhatsAppReply(from, "🚫 Trial limit reached. Subscribe here: https://kudiledger.com/pricing");
      return new Response("Limit reached", { status: 200 });
    }

    // 5. AI Extraction
    const extracted = await processBusinessMessage(text);

    // 6. Save & Final Reply
    if (extracted.type === 'profile_update') {
      await supabase.from('profiles').update({ business_name: extracted.business_name }).eq('id', profile?.id);
      await sendWhatsAppReply(from, `✅ Business name updated to: ${extracted.business_name}`);
    } else {
      await supabase.from('transactions').insert([{ user_id: profile?.id, ...extracted }]);
      await supabase.rpc('increment_trial', { target_user_id: profile?.id });
      
      const amount = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(extracted.total);
      await sendWhatsAppReply(from, `✅ Recorded: ${extracted.item} (${amount})`);
    }

    return new Response("Success", { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    await sendWhatsAppReply(from, "❌ Sorry, I couldn't process that. Please try again or type your message.");
    return new Response("Error", { status: 500 });
  }
};

async function sendWhatsAppReply(to: string, text: string) {
  const phoneId = import.meta.env.VITE_WHATSAPP_PHONE_ID;
  const token = import.meta.env.WHATSAPP_ACCESS_TOKEN;

  try {
    await axios.post(
      `https://graph.facebook.com/v17.0/${phoneId}/messages`,
      { messaging_product: "whatsapp", to, type: "text", text: { body: text } },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (err) {
    console.error("Failed to send WhatsApp reply:", err);
  }
}