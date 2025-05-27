import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sprout, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ResendVerification = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Get the base URL for redirect
      const productionUrl = 'https://nakuru-agri-senti-webapp.vercel.app';
      const baseUrl = import.meta.env.PROD 
        ? productionUrl
        : window.location.origin;
        
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${baseUrl}/verify-email`
        }
      });
      
      if (error) throw error;
      
      setSuccess(true);
      toast({
        title: "Verification email sent",
        description: "Please check your inbox (and spam folder) for the verification link.",
      });
    } catch (error) {
      console.error("Error resending verification:", error);
      toast({
        title: "Failed to send verification email",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-16 px-4 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="bg-green-600 p-3 rounded-full">
              <Sprout className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-green-800">
              {success ? "Verification Email Sent" : "Resend Verification Email"}
            </CardTitle>
            <CardDescription className="text-green-600">
              {success 
                ? "Please check your email for the verification link." 
                : "Enter your email address to receive a new verification link."}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          {!success ? (
            <form onSubmit={handleResendVerification} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Resend Verification Email"
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center">
              <p className="mb-4 text-green-800">
                A verification email has been sent to {email}. Please check your inbox and spam folders.
              </p>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                }}
              >
                Send to Another Email
              </Button>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <Link 
              to="/auth" 
              className="inline-flex items-center text-sm text-green-600 hover:text-green-700"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResendVerification;
