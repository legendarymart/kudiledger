"use client";

import React from 'react';
import { Users, Receipt, TrendingUp, Globe } from "lucide-react";

const stats = [
  { label: "Active Traders", value: "2,000+", icon: <Users className="h-5 w-5" /> },
  { label: "Transactions Recorded", value: "₦450M+", icon: <TrendingUp className="h-5 w-5" /> },
  { label: "Receipts Generated", value: "15k+", icon: <Receipt className="h-5 w-5" /> },
  { label: "States Covered", value: "36", icon: <Globe className="h-5 w-5" /> },
];

const UsageStats = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
      {stats.map((stat, i) => (
        <div key={i} className="text-center p-6 bg-green-50 rounded-3xl border border-green-100">
          <div className="bg-white w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 text-green-600 shadow-sm">
            {stat.icon}
          </div>
          <p className="text-2xl md:text-3xl font-black text-green-700">{stat.value}</p>
          <p className="text-xs md:text-sm font-medium text-green-600/80 uppercase tracking-wider">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default UsageStats;