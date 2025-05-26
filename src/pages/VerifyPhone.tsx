import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Phone, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const VerifyPhone = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement resend verification code
      const response = await fetch('/api/resend-phone-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        toast({
          title: "Code sent!",
          description: "A new verification code has been sent to your phone.",
        });
        // Set 60 second countdown
        setTimeLeft(60);
        const timer = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        throw new Error('Failed to send verification code');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement verify phone
      const response = await fetch('/api/verify-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: verificationCode }),
      });

      if (response.ok) {
        toast({
          title: "Phone verified!",
          description: "Your phone number has been verified successfully.",
        });
        // Redirect to dashboard after verification
        navigate('/dashboard');
      } else {
        throw new Error('Invalid verification code');
      }
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "The code you entered is incorrect. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            <CardTitle className="text-2xl font-bold text-green-800">Verify Your Phone</CardTitle>
            <CardDescription className="text-green-600">
              Enter the 6-digit code sent to your phone
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="code"
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="pl-10 text-center tracking-widest"
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700" 
              disabled={isLoading || verificationCode.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify Phone"}
            </Button>
          </form>

          <div className="text-center space-y-4">
            <Button
              type="button"
              variant="ghost"
              className="text-green-600 hover:text-green-700"
              disabled={timeLeft > 0 || isLoading}
              onClick={handleResendCode}
            >
              {timeLeft > 0 ? `Resend code in ${timeLeft}s` : "Resend verification code"}
            </Button>

            <div>
              <Link 
                to="/dashboard" 
                className="inline-flex items-center text-sm text-green-600 hover:text-green-700"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to dashboard
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyPhone;
