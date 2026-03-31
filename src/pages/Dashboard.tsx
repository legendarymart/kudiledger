import { useState, useEffect } from "react";
import { supabase, Transaction, Profile } from "@/lib/supabase";
import { StatsCards } from "@/components/StatsCards";
import { TransactionTable } from "@/components/TransactionTable";
import { processBusinessMessage } from "@/lib/ai-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Loader2, LogOut } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleSimulateWhatsApp = async () => {
    if (!message.trim()) return;
    
    setProcessing(true);
    try {
      const extracted = await processBusinessMessage(message);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.from('transactions').insert([{
        user_id: user.id,
        ...extracted,
        created_at: new Date().toISOString()
      }]).select().single();

      if (error) throw error;

      setTransactions([data, ...transactions]);
      showSuccess(`Recorded: ${extracted.type === 'sale' ? 'Sold' : 'Bought'} ${extracted.qty} ${extracted.item} for ₦${extracted.total.toLocaleString()}`);
      setMessage("");
    } catch (err) {
      showError("Failed to process message. Try again.");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) {
      setTransactions(transactions.filter(t => t.id !== id));
      showSuccess("Transaction deleted");
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
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <StatsCards sales={totalSales} expenses={totalExpenses} />

        {/* WhatsApp Simulator */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100">
          <div className="flex items-center gap-2 mb-3 text-green-700 font-semibold">
            <MessageSquare className="h-5 w-5" />
            <span>WhatsApp Simulator</span>
          </div>
          <p className="text-xs text-gray-500 mb-3">Type like you're chatting on WhatsApp (e.g., "I sell 5 bags of rice for 5k each")</p>
          <div className="flex gap-2">
            <Input 
              placeholder="Type message..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSimulateWhatsApp()}
              disabled={processing}
              className="bg-gray-50 border-green-200 focus-visible:ring-green-500"
            />
            <Button 
              onClick={handleSimulateWhatsApp} 
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