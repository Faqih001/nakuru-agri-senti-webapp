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
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerificationStatus('error');
        return;
      }

      try {
        // TODO: Implement email verification
        const response = await fetch('/api/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setVerificationStatus('success');
          toast({
            title: "Email verified!",
            description: "Your email has been successfully verified.",
          });
          
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
        } else {
          throw new Error('Verification failed');
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
      description: "Your email has been successfully verified. You'll be redirected to the dashboard shortly.",
      buttonText: "Go to Dashboard"
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
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
            
            {content.buttonText && (
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => navigate(verificationStatus === 'success' ? '/dashboard' : '/resend-verification')}
              >
                {content.buttonText}
              </Button>
            )}

            <Link 
              to="/login" 
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
