import axios from 'axios';

const PAYSTACK_SECRET = import.meta.env.VITE_PAYSTACK_SECRET_KEY;

export const initializePayment = async (email: string, amount: number) => {
  // In a real production app, this should be done on the backend
  // Amount is in Kobo (Naira * 100)
  const response = await axios.post(
    'https://api.paystack.co/transaction/initialize',
    {
      email,
      amount: amount * 100,
      callback_url: `${window.location.origin}/dashboard?payment=success`,
      metadata: {
        custom_fields: [
          {
            display_name: "Subscription Type",
            variable_name: "sub_type",
            value: "monthly_premium"
          }
        ]
      }
    },
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data.data.authorization_url;
};