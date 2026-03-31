import { Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
      <div className="bg-green-50 p-6 rounded-full mb-6">
        <Zap className="h-12 w-12 text-green-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Your ledger is empty</h3>
      <p className="text-gray-500 max-w-sm mb-8">
        Start by recording your first sale or expense using the WhatsApp Simulator. Try saying "I sold 2 bags of rice for 15k".
      </p>
      <div className="flex items-center gap-2 text-sm font-bold text-green-600 animate-bounce">
        Use the simulator below <ArrowRight className="h-4 w-4 rotate-90" />
      </div>
    </div>
  );
};