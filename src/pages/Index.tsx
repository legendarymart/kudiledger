import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MessageSquare, TrendingUp, ShieldCheck, Smartphone, Mic, Zap, CheckCircle2, Play, LayoutDashboard, FileText } from "lucide-react";
import DemoModal from "@/components/DemoModal";
import Testimonials from "@/components/Testimonials";
import UsageStats from "@/components/UsageStats";
import VoiceNoteExamples from "@/components/VoiceNoteExamples";

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
          <a href="#testimonials" className="hover:text-green-600 transition-colors">Success Stories</a>
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

      {/* Usage Stats Section */}
      <section className="py-12 px-6 border-y border-gray-50">
        <div className="max-w-7xl mx-auto">
          <UsageStats />
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-24 px-6 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold leading-tight">Your Business at a Glance</h2>
            <p className="text-slate-400 text-lg">
              While you chat on WhatsApp, we build a professional dashboard for you. Track profits, manage inventory, and download reports.
            </p>
            <div className="space-y-4">
              {[
                { icon: <TrendingUp className="text-green-400" />, text: "Automatic Profit & Loss Charts" },
                { icon: <FileText className="text-blue-400" />, text: "Instant PDF Receipts for Customers" },
                { icon: <LayoutDashboard className="text-purple-400" />, text: "Clean, Simple Business Dashboard" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-200">
                  <div className="bg-white/10 p-2 rounded-lg">{item.icon}</div>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-10 bg-green-500/20 rounded-full blur-[100px]"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl p-2 border border-slate-700">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bbbda536339a?w=800&h=500&fit=crop" 
                alt="Dashboard Preview" 
                className="rounded-xl w-full grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute -bottom-6 -right-6 bg-green-600 p-6 rounded-2xl shadow-xl hidden md:block">
                <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Total Sales Today</p>
                <p className="text-3xl font-black">₦142,500</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Voice Note Examples Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <VoiceNoteExamples />
          </div>
          <div className="space-y-6 order-1 md:order-2">
            <h2 className="text-4xl font-bold text-gray-900">Speak, Don't Type.</h2>
            <p className="text-lg text-gray-600">
              Our AI is trained on Nigerian accents and Pidgin English. Just send a voice note while you're attending to customers, and we'll handle the math.
            </p>
            <ul className="space-y-3">
              {['Understands Pidgin English', 'Extracts Qty & Price automatically', 'Works even with background noise'].map((text, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-700 font-medium">
                  <CheckCircle2 className="h-5 w-5 text-green-600" /> {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">Trusted by Smart Entrepreneurs</h2>
            <p className="text-lg text-gray-600">Join thousands of traders who have moved from paper notebooks to KudiLedger.</p>
          </div>
          <Testimonials />
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
          <p>© 2026 KudiLedger. Built for the Nigerian Spirit.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;