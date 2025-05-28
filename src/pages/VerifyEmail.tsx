import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Check, XCircle, Loader2, ArrowLeft } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [verificationMessage, setVerificationMessage] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerificationStatus('error');
        toast({
          title: "Verification failed",
          description: "No verification token found",
          variant: "destructive"
        });
        return;
      }

      try {
        // Extract the token from URL (it comes as #access_token=xxx&type=recovery)
        const hashParams = new URLSearchParams(token.replace('#', ''));
        const accessToken = hashParams.get('access_token');

        if (!accessToken) {
          throw new Error('Invalid verification link');
        }

        const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-email`;
        const response = await fetch(functionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ token: accessToken }),
        });

        const data = await response.json();

        if (response.ok && data.message) {
          setVerificationStatus('success');
          setVerificationMessage("Your email has been successfully verified. Please wait while we complete the account setup...");
          toast({
            title: "Email verified!",
            description: "Your email has been successfully verified.",
          });
          
          // Extract email and redirectUrl from the response
          const userEmail = data.user?.email || '';
          const productionUrl = 'https://nakuru-agri-senti-webapp.vercel.app';
          // Always use the production URL as requested
          const redirectUrl = data.redirectUrl || `${productionUrl}/auth`;
          
          // Add a longer delay to give Supabase time to complete the user creation in the auth system
          // This helps prevent foreign key constraint violations when creating user profiles
          setTimeout(() => {
            setVerificationMessage("Account setup completed! Redirecting you to login...");
            
            // Wait a bit more before redirecting
            setTimeout(() => {
              // Construct the full URL with query parameters
              const redirectWithParams = `${redirectUrl}?verified=true&email=${encodeURIComponent(userEmail)}`;
              
              // Use window.location for full page redirect to external URL if needed
              if (redirectUrl.startsWith('http')) {
                window.location.href = redirectWithParams;
              } else {
                // Use navigate for internal routing
                navigate(redirectWithParams);
              }
            }, 2000);
          }, 5000);
        } else {
          throw new Error(data.error || 'Verification failed');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
        toast({
          title: "Verification failed",
          description: "Invalid or expired verification link.",
          variant: "destructive"
        });
      }
    };

    verifyEmail();
  }, [token, toast, navigate]);

  const contentByStatus = {
    loading: {
      icon: <Loader2 className="w-12 h-12 text-green-600 animate-spin" />,
      title: "Verifying Your Email",
      description: "Please wait while we verify your email address...",
      buttonText: null
    },
    success: {
      icon: <Check className="w-12 h-12 text-green-600" />,
      title: "Email Verified",
      description: verificationMessage || "Your email has been successfully verified. You'll be redirected to the login page shortly.",
      buttonText: "Go to Login"
    },
    error: {
      icon: <XCircle className="w-12 h-12 text-red-600" />,
      title: "Verification Failed",
      description: "The verification link is invalid or has expired. Please request a new verification link.",
      buttonText: "Request New Link"
    }
  };

  const content = contentByStatus[verificationStatus];

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
            <CardTitle className="text-2xl font-bold text-green-800">{content.title}</CardTitle>
            <CardDescription className="text-green-600">{content.description}</CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col items-center space-y-6">
            <div className="p-4">
              {content.icon}
            </div>
            
            {content.buttonText && verificationStatus !== 'success' && (
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => navigate('/resend-verification')}
              >
                {content.buttonText}
              </Button>
            )}

            {verificationStatus === 'success' && (
              <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
                <div className="h-full w-full bg-green-600 animate-pulse"></div>
              </div>
            )}

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

export default VerifyEmail;
