"use client";

import React from 'react';
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Mama Tobi",
    business: "Provision Store, Lagos",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop",
    quote: "KudiLedger changed my life. I just talk to my phone and my sales are recorded. No more missing money!"
  },
  {
    name: "Chidi Okafor",
    business: "Electronics Dealer, Aba",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    quote: "The PDF receipts are so professional. My customers trust me more now. Best 5k I ever spent."
  },
  {
    name: "Amina Bello",
    business: "Fashion Designer, Kano",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    quote: "I used to hate bookkeeping. Now I just send a voice note after every dress I sell. It's like magic."
  }
];

const Testimonials = () => {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {testimonials.map((t, i) => (
        <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col">
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-gray-600 italic mb-6 flex-1">"{t.quote}"</p>
          <div className="flex items-center gap-4">
            <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-green-100" />
            <div>
              <p className="font-bold text-gray-900">{t.name}</p>
              <p className="text-xs text-gray-500">{t.business}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Testimonials;