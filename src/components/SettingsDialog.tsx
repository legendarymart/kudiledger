import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, User, Building2, CreditCard, CheckCircle2 } from "lucide-react";
import { Profile, supabase } from "@/lib/supabase";
import { showSuccess, showError } from "@/utils/toast";

interface Props {
  profile: Profile | null;
  onUpdate: (name: string) => void;
}

export const SettingsDialog = ({ profile, onUpdate }: Props) => {
  const [name, setName] = useState(profile?.business_name || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ business_name: name })
        .eq('id', profile.id);
      
      if (error) throw error;
      onUpdate(name);
      showSuccess("Business name updated!");
    } catch (err) {
      showError("Failed to update business name.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="h-5 w-5 text-gray-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="business-name" className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-green-600" /> Business Name
            </Label>
            <div className="flex gap-2">
              <Input 
                id="business-name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter business name"
                className="rounded-xl"
              />
              <Button onClick={handleSave} disabled={loading} className="bg-green-600 hover:bg-green-700 rounded-xl">
                Save
              </Button>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-gray-700">
                <CreditCard className="h-4 w-4 text-blue-600" /> Subscription
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${profile?.is_subscribed ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {profile?.is_subscribed ? 'PREMIUM' : 'FREE TRIAL'}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              {profile?.is_subscribed 
                ? "You have unlimited access to all features." 
                : `You have used ${profile?.trial_count}/10 free records.`}
            </p>
            {profile?.is_subscribed && (
              <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                <CheckCircle2 className="h-3 w-3" /> Active until next billing cycle
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};