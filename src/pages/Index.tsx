import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MessageSquare, TrendingUp, ShieldCheck, Smartphone, Mic, Zap, CheckCircle2, Play } from "lucide-react";
import DemoModal from "@/components/DemoModal";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-green-600 p-1.5 rounded-lg">
            <Zap className="text-white h-6 w-6" />
          </div>
          <span className="text-2xl font-bold text-gray-900 tracking-tight">KudiLedger</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#features" className="hover:text-green-600 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-green-600 transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-green-600 transition-colors">Pricing</a>
        </div>
        <Button 
          onClick={() => navigate("/auth")}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6"
        >
          Sign In
        </Button>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden pt-16 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Trusted by 2,000+ Nigerian Traders
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-[1.1]">
              Bookkeeping as easy as <span className="text-green-600">Chatting.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Stop losing track of your money. Send a voice note or text on WhatsApp, and our AI records your sales and expenses instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                onClick={() => navigate("/auth")}
                className="bg-green-600 hover:bg-green-700 text-white h-14 px-10 text-lg rounded-xl shadow-lg shadow-green-200"
              >
                Start Free Trial
              </Button>
              <DemoModal 
                trigger={
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="h-14 px-10 text-lg rounded-xl border-2 flex items-center gap-2"
                  >
                    <Play className="h-5 w-5 fill-current" /> Watch Demo
                  </Button>
                }
              />
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-green-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 max-w-md mx-auto">
              {/* Mock WhatsApp UI */}
              <div className="bg-green-700 text-white p-4 rounded-t-2xl flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold">KudiLedger AI</p>
                  <p className="text-xs opacity-80">Online</p>
                </div>
              </div>
              <div className="p-4 space-y-4 bg-[#e5ddd5] min-h-[300px]">
                <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[80%] text-sm">
                  Welcome! Just tell me what you sold or bought today.
                </div>
                <div className="bg-[#dcf8c6] p-3 rounded-lg rounded-tr-none shadow-sm max-w-[80%] ml-auto text-sm">
                  I just sold 5 bags of rice for 45k each.
                </div>
                <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[80%] text-sm border-l-4 border-green-500">
                  <p className="font-bold text-green-700">✅ Recorded!</p>
                  <p>Item: Rice (5 bags)</p>
                  <p>Total: ₦225,000</p>
                  <p>Type: Sale</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section id="features" className="py-24 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">Built for the Nigerian Market</h2>
            <p className="text-lg text-gray-600">We understand how you do business. No complex forms, just simple conversations.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Mic className="h-8 w-8 text-blue-600" />,
                title: "Voice Notes Support",
                desc: "Too busy to type? Send a voice note in English or Pidgin. Our AI understands perfectly."
              },
              {
                icon: <TrendingUp className="h-8 w-8 text-green-600" />,
                title: "Real-time Profit Tracking",
                desc: "See exactly how much you're making. No more guessing at the end of the month."
              },
              {
                icon: <ShieldCheck className="h-8 w-8 text-purple-600" />,
                title: "Professional Reports",
                desc: "Generate PDF receipts and monthly financial statements with one click."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="mb-6 bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-green-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">Ready to digitize your business?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join thousands of smart entrepreneurs who use KudiLedger to stay organized and grow.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="bg-white text-green-700 hover:bg-gray-100 h-16 px-12 text-xl rounded-2xl font-bold"
            >
              Get Started for Free
            </Button>
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              {['No credit card required', '10 free records', 'WhatsApp integrated'].map((text, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-5 w-5" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-gray-100 text-center text-gray-500">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Zap className="text-green-600 h-5 w-5" />
            <span className="font-bold text-gray-900">KudiLedger</span>
          </div>
          <p>© 2024 KudiLedger. Built for the Nigerian Spirit.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;