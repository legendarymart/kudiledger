import { supabase } from "../src/lib/supabase.js";
import { processBusinessMessage } from "../src/lib/ai-service.js";
import axios from "axios";

export default async function handler(req: any, res: any) {
  // 1. Handle Webhook Verification (GET Handshake)
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    // We check both VITE_WHATSAPP_VERIFY_TOKEN and WHATSAPP_VERIFY_TOKEN for compatibility
    const verifyToken = process.env.VITE_WHATSAPP_VERIFY_TOKEN || process.env.WHATSAPP_VERIFY_TOKEN;

    if (mode === "subscribe" && token === verifyToken) {
      console.log("Webhook Verified Successfully");
      // Meta requires the challenge to be returned as a plain string
      return res.status(200).send(challenge);
    }
    
    console.error("Webhook Verification Failed: Token mismatch or missing parameters");
    return res.status(403).send("Forbidden");
  }

  // 2. Handle Incoming Messages (POST)
  if (req.method === "POST") {
    try {
      const entry = req.body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const message = value?.messages?.[0];

      if (!message) return res.status(200).send("OK");

      const from = message.from;
      const text = message.text?.body;

      if (!text) return res.status(200).send("OK");

      // Find or create profile
      let { data: profile } = await supabase.from('profiles').select('*').eq('phone_number', from).single();
      if (!profile) {
        const { data: newProfile } = await supabase.from('profiles').insert([{ phone_number: from }]).select().single();
        profile = newProfile;
      }

      // Check trial limit
      if (!profile?.is_subscribed && (profile?.trial_count || 0) >= 10) {
        await sendWhatsAppReply(from, "🚫 Trial limit reached. Please subscribe at kudiledger.com");
        return res.status(200).send("OK");
      }

      // Process with AI
      const extracted = await processBusinessMessage(text);

      // Save to DB
      if (extracted.type === 'profile_update') {
        await supabase.from('profiles').update({ business_name: extracted.business_name }).eq('id', profile?.id);
        await sendWhatsAppReply(from, `✅ Business name updated to: ${extracted.business_name}`);
      } else {
        await supabase.from('transactions').insert([{ user_id: profile?.id, ...extracted }]);
        await supabase.rpc('increment_trial', { target_user_id: profile?.id });
        await sendWhatsAppReply(from, `✅ Recorded: ${extracted.item} (₦${extracted.total.toLocaleString()})`);
      }

      return res.status(200).send("OK");
    } catch (error) {
      console.error("Webhook Processing Error:", error);
      return res.status(200).send("OK"); 
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

async function sendWhatsAppReply(to: string, text: string) {
  const phoneId = process.env.VITE_WHATSAPP_PHONE_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;

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
