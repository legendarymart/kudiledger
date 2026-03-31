import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MessageSquare, TrendingUp, ShieldCheck, Smartphone } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="bg-green-600 text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold mb-6">KudiLedger</h1>
          <p className="text-xl mb-8 opacity-90">
            The WhatsApp AI Bookkeeper for Nigerian Traders. 
            Turn your voice notes and chats into professional financial records.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="bg-white text-green-700 hover:bg-gray-100 font-bold text-lg px-8"
            >
              Get Started Free
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-green-700 font-bold text-lg px-8"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">Why Traders Love KudiLedger</h2>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center space-y-4">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <MessageSquare className="text-green-600 h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">WhatsApp First</h3>
            <p className="text-gray-600">No new app to learn. Just chat with our AI assistant like you chat with family.</p>
          </div>
          <div className="text-center space-y-4">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <TrendingUp className="text-green-600 h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Smart Insights</h3>
            <p className="text-gray-600">Automatically track sales, expenses, and profit. See your business health in real-time.</p>
          </div>
          <div className="text-center space-y-4">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <Smartphone className="text-green-600 h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Voice to Record</h3>
            <p className="text-gray-600">Too busy to type? Send a voice note in English or Pidgin. Our AI handles the rest.</p>
          </div>
        </div>
      </section>

      {/* Social Proof / CTA */}
      <section className="bg-gray-50 py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">Ready to grow your business?</h2>
          <p className="text-gray-600">Join thousands of Nigerian entrepreneurs using KudiLedger to stay organized.</p>
          <Button 
            size="lg" 
            onClick={() => navigate("/auth")}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-12"
          >
            Start Now
          </Button>
        </div>
      </section>

      <footer className="py-8 text-center text-gray-400 text-sm">
        © 2024 KudiLedger. Built for the Nigerian Spirit.
      </footer>
    </div>
  );
};

export default Index;