"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Zap, MessageSquare, BarChart3, CheckCircle2, Loader2, RefreshCw } from "lucide-react";

interface DemoModalProps {
  trigger: React.ReactNode;
}

const DemoModal = ({ trigger }: DemoModalProps) => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const startDemo = () => {
    setIsPlaying(true);
    setStep(1);
  };

  useEffect(() => {
    if (!isPlaying) return;

    const timers = [
      setTimeout(() => setStep(2), 2000), // User sends message
      setTimeout(() => setStep(3), 4000), // AI Processing
      setTimeout(() => setStep(4), 6000), // Success & Ledger Update
    ];

    return () => timers.forEach(clearTimeout);
  }, [isPlaying]);

  const resetDemo = () => {
    setStep(0);
    setIsPlaying(false);
  };

  return (
    <Dialog onOpenChange={(open) => !open && resetDemo()}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl">
        <div className="grid md:grid-cols-5 h-full min-h-[500px]">
          {/* Left Side: The Animation */}
          <div className="md:col-span-3 bg-slate-900 p-8 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent)] pointer-events-none" />
            
            {!isPlaying ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 z-10">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                  <Play className="text-white h-10 w-10 fill-current ml-1" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Experience the Magic</h3>
                  <p className="text-slate-400 max-w-xs">See how KudiLedger turns simple chats into professional records.</p>
                </div>
                <Button onClick={startDemo} className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-8 font-bold">
                  Start Walkthrough
                </Button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col z-10">
                {/* Simulated Phone UI */}
                <div className="max-w-[320px] mx-auto w-full bg-[#e5ddd5] rounded-[2rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden flex flex-col h-full max-h-[450px]">
                  <div className="bg-[#075e54] p-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Zap className="text-white h-4 w-4" />
                    </div>
                    <div className="text-white">
                      <p className="text-xs font-bold">KudiLedger AI</p>
                      <p className="text-[10px] opacity-70">Online</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                    {step >= 1 && (
                      <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm text-[11px] max-w-[85%] animate-in fade-in slide-in-from-left-2 duration-500">
                        Hello! What did you sell or buy today?
                      </div>
                    )}
                    
                    {step >= 2 && (
                      <div className="bg-[#dcf8c6] p-2 rounded-lg rounded-tr-none shadow-sm text-[11px] max-w-[85%] ml-auto animate-in fade-in slide-in-from-right-2 duration-500">
                        I just sold 5 bags of rice for 15k each.
                      </div>
                    )}

                    {step === 3 && (
                      <div className="bg-white/50 backdrop-blur-sm p-2 rounded-lg text-[10px] flex items-center gap-2 text-slate-600 italic animate-pulse">
                        <Loader2 className="h-3 w-3 animate-spin" /> AI is extracting details...
                      </div>
                    )}

                    {step >= 4 && (
                      <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm text-[11px] max-w-[85%] border-l-4 border-green-500 animate-in zoom-in-95 duration-500">
                        <p className="font-bold text-green-700 mb-1 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Recorded Successfully!
                        </p>
                        <div className="space-y-0.5 text-slate-600">
                          <p>Item: <span className="font-bold text-slate-900">Rice</span></p>
                          <p>Qty: <span className="font-bold text-slate-900">5 bags</span></p>
                          <p>Total: <span className="font-bold text-slate-900">₦75,000</span></p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {step === 4 && (
                  <div className="mt-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Button onClick={resetDemo} variant="ghost" className="text-slate-400 hover:text-white gap-2">
                      <RefreshCw className="h-4 w-4" /> Replay Demo
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Side: Explanation */}
          <div className="md:col-span-2 p-10 bg-white flex flex-col justify-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">How it works</h2>
                <p className="text-slate-500">Three simple steps to financial freedom.</p>
              </div>

              <div className="space-y-6">
                <div className={`flex gap-4 transition-all duration-500 ${step >= 2 ? 'opacity-100 translate-x-0' : 'opacity-40 -translate-x-2'}`}>
                  <div className="bg-green-100 p-3 h-fit rounded-2xl">
                    <MessageSquare className="text-green-600 h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">1. Just Chat</p>
                    <p className="text-sm text-slate-500 leading-relaxed">Send a text or voice note exactly how you'd talk to a friend.</p>
                  </div>
                </div>

                <div className={`flex gap-4 transition-all duration-500 ${step >= 3 ? 'opacity-100 translate-x-0' : 'opacity-40 -translate-x-2'}`}>
                  <div className="bg-blue-100 p-3 h-fit rounded-2xl">
                    <Zap className="text-blue-600 h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">2. AI Magic</p>
                    <p className="text-sm text-slate-500 leading-relaxed">Our AI extracts items, quantities, and prices automatically.</p>
                  </div>
                </div>

                <div className={`flex gap-4 transition-all duration-500 ${step >= 4 ? 'opacity-100 translate-x-0' : 'opacity-40 -translate-x-2'}`}>
                  <div className="bg-purple-100 p-3 h-fit rounded-2xl">
                    <BarChart3 className="text-purple-600 h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">3. Instant Ledger</p>
                    <p className="text-sm text-slate-500 leading-relaxed">Your dashboard updates in real-time with charts and receipts.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full bg-green-600 hover:bg-green-700 h-14 rounded-2xl font-bold text-lg shadow-lg shadow-green-100">
                  Get Started Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DemoModal;