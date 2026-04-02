import { supabase } from "./supabase";
import crypto from "crypto";

/**
 * PAYSTACK WEBHOOK HANDLER
 * Route: /api/paystack-callback
 */
export const handlePaystackWebhook = async (req: Request) => {
  const body = await req.json();
  const hash = crypto
    .createHmac("sha512", import.meta.env.VITE_PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(body))
    .digest("hex");

  // 1. Verify Signature
  if (hash !== req.headers.get("x-paystack-signature")) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 2. Handle Successful Payment
  if (body.event === "charge.success") {
    const email = body.data.customer.email;
    
    // Find user by email (assuming email is linked to profile)
    // In a real app, you'd pass the user_id in the metadata during initialization
    const userId = body.data.metadata?.user_id;

    if (userId) {
      const { error } = await supabase
        .from('profiles')
        .update({ is_subscribed: true })
        .eq('id', userId);

      if (error) console.error("Failed to update subscription:", error);
    }
  }

  return new Response("OK", { status: 200 });
};