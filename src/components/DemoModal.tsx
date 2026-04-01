"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Zap, MessageSquare, BarChart3 } from "lucide-react";

interface DemoModalProps {
  trigger: React.ReactNode;
}

const DemoModal = ({ trigger }: DemoModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden rounded-3xl border-none">
        <DialogHeader className="p-6 bg-green-600 text-white">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Play className="fill-current h-6 w-6" /> See KudiLedger in Action
          </DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2">
          <div className="bg-gray-900 aspect-video md:aspect-auto flex items-center justify-center relative group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-full group-hover:scale-110 transition-transform">
              <Play className="text-white h-12 w-12 fill-current" />
            </div>
            <p className="absolute bottom-4 left-4 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Click to play walkthrough
            </p>
          </div>
          <div className="p-8 space-y-6 bg-white">
            <h3 className="text-xl font-bold text-gray-900">How it works</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="bg-green-100 p-2 h-fit rounded-lg">
                  <MessageSquare className="text-green-600 h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">1. Send a Message</p>
                  <p className="text-sm text-gray-500">Text or voice note: "I sold 3 bags of cement for 15k each"</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-blue-100 p-2 h-fit rounded-lg">
                  <Zap className="text-blue-600 h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">2. AI Processes It</p>
                  <p className="text-sm text-gray-500">Our AI instantly extracts the item, quantity, and price.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-purple-100 p-2 h-fit rounded-lg">
                  <BarChart3 className="text-purple-600 h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">3. Track Growth</p>
                  <p className="text-sm text-gray-500">View your profit charts and generate receipts automatically.</p>
                </div>
              </div>
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700 h-12 rounded-xl font-bold mt-4">
              Get Started Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DemoModal;