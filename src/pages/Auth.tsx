import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "@/utils/toast";
import { Loader2, Phone, ShieldCheck } from "lucide-react";

const Auth = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Ensure phone number is formatted correctly for Supabase
    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ 
          phone: formattedPhone, 
          password 
        });
        if (error) throw error;
        showSuccess("Account created! You can now sign in.");
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ 
          phone: formattedPhone, 
          password 
        });
        if (error) throw error;
        navigate("/dashboard");
      }
    } catch (err: any) {
      showError(err.message || "Authentication failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="text-center pt-10">
          <div className="bg-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-200">
            <ShieldCheck className="text-white h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">KudiLedger</CardTitle>
          <CardDescription className="text-base">
            {isSignUp ? "Secure your business records" : "Welcome back, Boss!"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10 px-8">
          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-2">
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  type="tel" 
                  placeholder="Phone (e.g. +234...)" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50 focus-visible:ring-green-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus-visible:ring-green-500"
              />
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700 h-14 rounded-2xl text-lg font-bold shadow-lg shadow-green-100" disabled={loading}>
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (isSignUp ? "Create Account" : "Sign In")}
            </Button>
            <p className="text-center text-sm text-gray-500 pt-2">
              {isSignUp ? "Already have an account?" : "New to KudiLedger?"}{" "}
              <button 
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-green-600 font-bold hover:underline"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;