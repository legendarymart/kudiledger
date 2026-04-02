import { processBusinessMessage, transcribeAudio } from "./ai-service";
import { supabase } from "./supabase";
import axios from "axios";

/**
 * This function simulates what happens when a real WhatsApp message hits your server.
 * In production, this would be an API route (e.g., /api/whatsapp).
 */
export const handleIncomingWhatsApp = async (payload: any) => {
  const message = payload.entry[0].changes[0].value.messages[0];
  const from = message.from; // Phone number
  const type = message.type;

  // 1. Find or Create Profile
  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('phone_number', from)
    .single();

  if (!profile) {
    // Onboarding: Create new profile
    const { data: newProfile } = await supabase
      .from('profiles')
      .insert([{ phone_number: from, trial_count: 0 }])
      .select()
      .single();
    profile = newProfile;
  }

  // 2. Gatekeeper Logic
  if (!profile?.is_subscribed && (profile?.trial_count || 0) >= 10) {
    return {
      reply: "You have reached your free limit of 10 records. Please subscribe here to continue: https://kudiledger.com/pricing",
      status: "limit_reached"
    };
  }

  // 3. Process Content
  let text = "";
  if (type === 'text') {
    text = message.text.body;
  } else if (type === 'audio') {
    // In production, you'd download the media from Meta's servers first
    // const audioUrl = await getWhatsAppMediaUrl(message.audio.id);
    // const audioFile = await downloadMedia(audioUrl);
    // text = await transcribeAudio(audioFile);
    text = "[Audio Transcription Simulated]"; 
  }

  // 4. AI Extraction
  const extracted = await processBusinessMessage(text);

  // 5. Save Transaction & Increment Trial
  if (extracted.type !== 'profile_update') {
    await supabase.from('transactions').insert([{
      user_id: profile?.id,
      ...extracted
    }]);
    
    // Call the SQL function we created
    await supabase.rpc('increment_trial', { target_user_id: profile?.id });
  } else {
    await supabase.from('profiles').update({ business_name: extracted.business_name }).eq('id', profile?.id);
  }

  return {
    reply: `✅ Recorded: ${extracted.item} (${extracted.type})`,
    data: extracted
  };
};