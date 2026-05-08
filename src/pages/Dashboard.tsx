import { useState, useEffect } from "react";
import { supabase, Transaction, Profile } from "@/lib/supabase";
import { StatsCards } from "@/components/StatsCards";
import { TransactionTable } from "@/components/TransactionTable";
import { BusinessCharts } from "@/components/BusinessCharts";
import { SettingsDialog } from "@/components/SettingsDialog";
import { WhatsAppSimulator } from "@/components/WhatsAppSimulator";
import { EmptyState } from "@/components/EmptyState";
import { EditTransactionDialog } from "@/components/EditTransactionDialog";
import { processBusinessMessage } from "@/lib/ai-service";
import { initializePayment } from "@/lib/paystack";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, AlertCircle, CreditCard, LayoutDashboard, TrendingUp } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [isManualAddOpen, setIsManualAddOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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
    showSuccess("Subscription activated!");
    fetchData();
  };

  const handleSubscribe = async () => {
    if (!profile) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const url = await initializePayment(user?.email || "", 5000);
      window.location.href = url;
    } catch (err) {
      showError("Failed to initialize payment.");
    }
  };

  const handleProcessMessage = async (text: string) => {
    if (!profile) return;
    if (!profile.is_subscribed && profile.trial_count >= 10) {
      showError("Trial limit reached. Please subscribe.");
      return;
    }

    setProcessing(true);
    try {
      const extracted = await processBusinessMessage(text);
      if (extracted.type === 'profile_update') {
        await supabase.from('profiles').update({ business_name: extracted.business_name }).eq('id', profile.id);
        setProfile({ ...profile, business_name: extracted.business_name });
        showSuccess(`Business name updated!`);
      } else {
        const { data, error } = await supabase.from('transactions').insert([{
          user_id: profile.id,
          ...extracted,
          created_at: new Date().toISOString()
        }]).select().single();
        
        if (error) throw error;

        // Use the SQL RPC function to increment trial count
        await supabase.rpc('increment_trial', { target_user_id: profile.id });
        
        setTransactions([data, ...transactions]);
        setProfile({ ...profile, trial_count: profile.trial_count + 1 });
        showSuccess(`✅ Recorded: ${extracted.item}`);
      }
    } catch (err) {
      showError("Failed to process message.");
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) {
      setTransactions(transactions.filter(t => t.id !== id));
      showSuccess("Deleted.");
    }
  };

  const handleUpdate = (updated: Transaction) => {
    setTransactions(transactions.map(t => t.id === updated.id ? updated : t));
  };

  const handleManualAdd = (newTransaction: Transaction) => {
    setTransactions([newTransaction, ...transactions]);
    if (profile) setProfile({ ...profile, trial_count: profile.trial_count + 1 });
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-green-600" /></div>;

  const totalSales = transactions.filter(t => t.type === 'sale').reduce((acc, curr) => acc + curr.total, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.total, 0);

  const topItems = Object.entries(
    transactions
      .filter(t => t.type === 'sale')
      .reduce((acc: any, t) => {
        acc[t.item] = (acc[t.item] || 0) + t.total;
        return acc;
      }, {})
  )
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b p-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 p-2 rounded-xl shadow-lg shadow-green-100">
              <LayoutDashboard className="text-white h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">KudiLedger</h1>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{profile?.business_name || "My Business"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!profile?.is_subscribed && (
              <Button variant="outline" size="sm" onClick={handleSubscribe} className="text-green-600 border-green-600 hidden sm:flex rounded-full font-bold">
                <CreditCard className="h-4 w-4 mr-2" /> Upgrade
              </Button>
            )}
            <SettingsDialog profile={profile} onUpdate={(name) => setProfile(prev => prev ? {...prev, business_name: name} : null)} />
            <Button variant="ghost" size="icon" onClick={() => supabase.auth.signOut().then(() => navigate("/auth"))} className="rounded-full">
              <LogOut className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 space-y-8">
        {!profile?.is_subscribed && profile?.trial_count !== undefined && profile.trial_count >= 7 && (
          <Alert className="bg-amber-50 border-amber-200 rounded-[2rem] p-6">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <div className="ml-4">
              <AlertTitle className="font-bold text-amber-900">Trial Ending Soon</AlertTitle>
              <AlertDescription className="text-amber-800">
                You have used {profile.trial_count}/10 free records. 
                <button onClick={handleSubscribe} className="ml-2 font-bold underline">Subscribe now</button> to keep growing.
              </AlertDescription>
            </div>
          </Alert>
        )}

        <StatsCards sales={totalSales} expenses={totalExpenses} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <BusinessCharts transactions={transactions} />
            {transactions.length === 0 ? (
              <EmptyState />
            ) : (
              <TransactionTable 
                transactions={transactions} 
                onDelete={handleDelete} 
                onUpdate={handleUpdate}
                onAddManual={() => setIsManualAddOpen(true)}
                businessName={profile?.business_name || "My Business"} 
              />
            )}
          </div>
          
          <div className="space-y-8">
            <WhatsAppSimulator 
              onProcess={handleProcessMessage} 
              processing={processing} 
              disabled={!profile?.is_subscribed && (profile?.trial_count || 0) >= 10}
            />
            
            {topItems.length > 0 && (
              <Card className="border-none shadow-sm bg-white rounded-[2rem] overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" /> Top Selling Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topItems.map(([item, total]: any, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                      <span className="font-medium text-gray-700">{item}</span>
                      <span className="font-bold text-green-600">₦{total.toLocaleString()}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <EditTransactionDialog 
        transaction={isManualAddOpen ? { 
          id: 'new', 
          user_id: profile?.id || '', 
          item: '', 
          qty: 1, 
          total: 0, 
          currency: 'NGN', 
          type: 'sale', 
          created_at: new Date().toISOString() 
        } : null}
        open={isManualAddOpen}
        onOpenChange={setIsManualAddOpen}
        onUpdate={(t) => {
          handleManualAdd(t);
          setIsManualAddOpen(false);
        }}
      />
    </div>
  );
};

export default Dashboard;