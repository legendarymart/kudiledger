import { supabase } from "./supabase";
import { processBusinessMessage, transcribeAudio } from "./ai-service";
import axios from "axios";

/**
 * WHATSAPP WEBHOOK HANDLER
 * This handles both the GET (Verification) and POST (Messages) requests.
 */

// 1. WEBHOOK VERIFICATION (GET)
export const verifyWebhook = (req: Request) => {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  // Replace 'YOUR_VERIFY_TOKEN' with the one you set in Meta Dashboard
  if (mode === "subscribe" && token === import.meta.env.VITE_WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
};

// 2. MESSAGE HANDLING (POST)
export const handleWhatsAppMessage = async (body: any) => {
  try {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message) return new Response("No message", { status: 200 });

    const from = message.from; // User's phone number
    const type = message.type;
    let text = "";

    // A. Handle Audio (Voice Notes)
    if (type === "audio") {
      const audioId = message.audio.id;
      
      // Get Media URL from Meta
      const mediaRes = await axios.get(
        `https://graph.facebook.com/v17.0/${audioId}`,
        { headers: { Authorization: `Bearer ${import.meta.env.WHATSAPP_ACCESS_TOKEN}` } }
      );
      
      // Download the audio file
      const audioDownload = await axios.get(mediaRes.data.url, {
        headers: { Authorization: `Bearer ${import.meta.env.WHATSAPP_ACCESS_TOKEN}` },
        responseType: 'arraybuffer'
      });

      const audioFile = new File([audioDownload.data], "voice.ogg", { type: "audio/ogg" });
      
      // Transcribe with Whisper
      text = await transcribeAudio(audioFile);
    } 
    // B. Handle Text
    else if (type === "text") {
      text = message.text.body;
    }

    if (!text) return new Response("Empty message", { status: 200 });

    // 3. Find User Profile
    let { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('phone_number', from)
      .single();

    if (!profile) {
      // Auto-onboard new users
      const { data: newProfile } = await supabase
        .from('profiles')
        .insert([{ phone_number: from }])
        .select()
        .single();
      profile = newProfile;
    }

    // 4. Gatekeeper (10 record limit)
    if (!profile?.is_subscribed && (profile?.trial_count || 0) >= 10) {
      await sendWhatsAppReply(from, "🚫 Trial limit reached. Please subscribe to continue: https://kudiledger.com/pricing");
      return new Response("Limit reached", { status: 200 });
    }

    // 5. AI Processing
    const extracted = await processBusinessMessage(text);

    // 6. Save to Database
    if (extracted.type === 'profile_update') {
      await supabase.from('profiles').update({ business_name: extracted.business_name }).eq('id', profile?.id);
      await sendWhatsAppReply(from, `✅ Business name updated to: ${extracted.business_name}`);
    } else {
      await supabase.from('transactions').insert([{
        user_id: profile?.id,
        ...extracted
      }]);
      
      // Increment trial count using SQL function
      await supabase.rpc('increment_trial', { target_user_id: profile?.id });
      
      await sendWhatsAppReply(from, `✅ Recorded: ${extracted.item} (₦${extracted.total.toLocaleString()})`);
    }

    return new Response("Success", { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return new Response("Error", { status: 500 });
  }
};

/**
 * Helper to send messages back to WhatsApp
 */
async function sendWhatsAppReply(to: string, text: string) {
  const phoneId = import.meta.env.VITE_WHATSAPP_PHONE_ID;
  const token = import.meta.env.WHATSAPP_ACCESS_TOKEN;

  await axios.post(
    `https://graph.facebook.com/v17.0/${phoneId}/messages`,
    {
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: { body: text }
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}