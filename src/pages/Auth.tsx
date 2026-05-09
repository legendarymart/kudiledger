import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

const Auth = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate("/dashboard");
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="text-center pt-10">
          <div className="bg-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-200">
            <ShieldCheck className="text-white h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">KudiLedger</CardTitle>
          <CardDescription className="text-base">
            Secure your business records with your phone number
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10 px-8">
          <SupabaseAuth
            supabaseClient={supabase}
            providers={[]}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#16a34a',
                    brandAccent: '#15803d',
                  },
                },
              },
              className: {
                button: 'rounded-xl h-12 font-bold',
                input: 'rounded-xl h-12 bg-gray-50',
              }
            }}
            theme="light"
            onlyThirdPartyProviders={false}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;