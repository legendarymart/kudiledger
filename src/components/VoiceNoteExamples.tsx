"use client";

import React from 'react';
import { Mic, Play, Volume2 } from "lucide-react";

const examples = [
  {
    text: "I just sold 2 bags of cement for 12k each to Oga Paul.",
    duration: "0:08",
    result: "Recorded: Cement (2 bags) - ₦24,000"
  },
  {
    text: "Buy fuel for generator 5,500 naira today.",
    duration: "0:05",
    result: "Recorded: Fuel (Expense) - ₦5,500"
  }
];

const VoiceNoteExamples = () => {
  return (
    <div className="space-y-4">
      {examples.map((ex, i) => (
        <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-green-200 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-100 p-2 rounded-full text-green-600">
              <Mic className="h-4 w-4" />
            </div>
            <div className="flex-1 h-8 bg-gray-50 rounded-full flex items-center px-3 gap-2">
              <Play className="h-3 w-3 fill-green-600 text-green-600" />
              <div className="flex-1 flex items-center gap-0.5">
                {[...Array(20)].map((_, j) => (
                  <div key={j} className="w-1 bg-green-200 rounded-full" style={{ height: `${Math.random() * 100}%`, minHeight: '4px' }} />
                ))}
              </div>
              <span className="text-[10px] font-mono text-gray-400">{ex.duration}</span>
            </div>
          </div>
          <div className="pl-11">
            <p className="text-sm text-gray-600 italic mb-2">"{ex.text}"</p>
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 rounded-md">
              <Volume2 className="h-3 w-3" /> {ex.result}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VoiceNoteExamples;