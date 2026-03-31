import { useState, useEffect, useRef } from "react";
import { supabase, Transaction, Profile } from "@/lib/supabase";
import { StatsCards } from "@/components/StatsCards";
import { TransactionTable } from "@/components/TransactionTable";
import { processBusinessMessage, transcribeAudio } from "@/lib/ai-service";
import { initializePayment } from "@/lib/paystack";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Loader2, LogOut, Mic, MicOff, AlertCircle, CreditCard } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  useEffect(() => {
    fetchData();
    if (searchParams.get('payment') === 'success') {
      handlePaymentSuccess();
    }
  }, [searchParams]);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const [transRes, profileRes] = await Promise.all([
      supabase.from('transactions').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').eq('id', user.id).single()
    ]);

    if (transRes.data) setTransactions(transRes.data);
    if (profileRes.data) setProfile(profileRes.data);
    setLoading(false);
  };

  const handlePaymentSuccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('profiles').update({ is_subscribed: true }).eq('id', user.id);
    showSuccess("Subscription activated! Thank you for your support.");
    fetchData();
  };

  const handleSubscribe = async () => {
    if (!profile) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const url = await initializePayment(user?.email || "", 5000); // 5000 Naira
      window.location.href = url;
    } catch (err) {
      showError("Failed to initialize payment.");
    }
  };

  const processInput = async (text: string) => {
    if (!profile) return;

    // Gatekeeper Logic
    if (!profile.is_subscribed && profile.trial_count >= 10) {
      showError("Trial limit reached. Please subscribe to continue.");
      return;
    }

    setProcessing(true);
    try {
      const extracted = await processBusinessMessage(text);
      
      if (extracted.type === 'profile_update') {
        const { error } = await supabase.from('profiles').update({ business_name: extracted.business_name }).eq('id', profile.id);
        if (!error) {
          setProfile({ ...profile, business_name: extracted.business_name });
          showSuccess(`Business name updated to: ${extracted.business_name}`);
        }
      } else {
        const { data, error } = await supabase.from('transactions').insert([{
          user_id: profile.id,
          ...extracted,
          created_at: new Date().toISOString()
        }]).select().single();

        if (error) throw error;

        // Increment trial count
        await supabase.rpc('increment_trial', { user_id_input: profile.id });
        
        setTransactions([data, ...transactions]);
        setProfile({ ...profile, trial_count: profile.trial_count + 1 });
        showSuccess(`✅ Recorded: ${extracted.type === 'sale' ? 'Sold' : 'Bought'} ${extracted.qty} ${extracted.item} for ₦${extracted.total.toLocaleString()}`);
      }
      setMessage("");
    } catch (err) {
      showError("Failed to process message. Try again.");
    } finally {
      setProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], "recording.wav", { type: 'audio/wav' });
        
        setProcessing(true);
        try {
          const text = await transcribeAudio(audioFile);
          setMessage(text);
          await processInput(text);
        } catch (err) {
          showError("Failed to transcribe audio.");
        } finally {
          setProcessing(false);
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      showError("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-green-600" /></div>;

  const totalSales = transactions.filter(t => t.type === 'sale').reduce((acc, curr) => acc + curr.total, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-green-700">KudiLedger</h1>
            <p className="text-xs text-gray-500">{profile?.business_name || "My Business"}</p>
          </div>
          <div className="flex items-center gap-2">
            {!profile?.is_subscribed && (
              <Button variant="outline" size="sm" onClick={handleSubscribe} className="text-green-600 border-green-600 hidden sm:flex">
                <CreditCard className="h-4 w-4 mr-2" /> Upgrade
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {!profile?.is_subscribed && profile?.trial_count && profile.trial_count >= 7 && (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle>Trial Ending Soon</AlertTitle>
            <AlertDescription>
              You have used {profile.trial_count}/10 free records. 
              <button onClick={handleSubscribe} className="ml-2 font-bold underline">Subscribe now</button> to keep using KudiLedger.
            </AlertDescription>
          </Alert>
        )}

        <StatsCards sales={totalSales} expenses={totalExpenses} />

        {/* WhatsApp Simulator */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-green-700 font-semibold">
              <MessageSquare className="h-5 w-5" />
              <span>WhatsApp Simulator</span>
            </div>
            {isRecording && <span className="text-xs text-red-500 animate-pulse font-bold">Recording...</span>}
          </div>
          
          <div className="flex gap-2">
            <Input 
              placeholder="Type or use mic..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && processInput(message)}
              disabled={processing}
              className="bg-gray-50 border-green-200 focus-visible:ring-green-500"
            />
            <Button 
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={processing}
              className={!isRecording ? "border-green-200 text-green-600" : ""}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button 
              onClick={() => processInput(message)} 
              disabled={processing || !message}
              className="bg-green-600 hover:bg-green-700"
            >
              {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <TransactionTable transactions={transactions} onDelete={handleDelete} />
      </main>
    </div>
  );
};

export default Dashboard;