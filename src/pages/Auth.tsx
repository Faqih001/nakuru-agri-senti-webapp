
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sprout, Eye, EyeOff, Mail, Lock, User, MapPin, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const Auth = () => {
  const { user, signIn, signUp, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useState(new URLSearchParams(window.location.search));
  
  const [loginData, setLoginData] = useState({
    email: searchParams.get('email') || "",
    password: ""
  });

  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    farmSize: ""
  });

  const [showPassword, setShowPassword] = useState({
    login: false,
    signup: false,
    confirm: false
  });

  const [loading, setLoading] = useState({
    login: false,
    signup: false
  });

  const [activeTab, setActiveTab] = useState("login");

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !authLoading) {
      navigate("/dashboard");
    }
    
    // Check if user is coming from verification
    const verificationSuccess = searchParams.get('verified') === 'true';
    const email = searchParams.get('email');
    
    if (verificationSuccess && email) {
      toast({
        title: "Email Verified",
        description: "Your email has been verified. You can now log in with your credentials.",
        variant: "default"
      });
      
      // Pre-fill the email field
      setLoginData(prev => ({ ...prev, email }));
      setActiveTab("login");
    }
  }, [user, authLoading, navigate, searchParams, toast]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, login: true }));

    const { error } = await signIn(loginData.email, loginData.password);
    
    if (!error) {
      navigate("/dashboard");
    } else {
      console.log("Login error:", error.message);
      // Error is already handled in AuthContext with toast messages
    }
    
    setLoading(prev => ({ ...prev, login: false }));
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      // Add toast message for password mismatch
      toast({
        title: "Password Error",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      return;
    }

    if (!signupData.location || !signupData.farmSize) {
      toast({
        title: "Missing Information",
        description: "Please select your location and farm size.",
        variant: "destructive"
      });
      return;
    }

    setLoading(prev => ({ ...prev, signup: true }));

    try {
      const { error } = await signUp(signupData.email, signupData.password, {
        full_name: signupData.fullName,
        location: signupData.location,
        farm_size: signupData.farmSize
      });
      
      if (!error) {
        navigate("/dashboard");
      } else {
        console.log("Signup error:", error.message);
        // Error is already handled in AuthContext with toast messages
      }
    } catch (err) {
      console.error("Unexpected signup error:", err);
      toast({
        title: "Sign Up Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, signup: false }));
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-green-600" />
          <span className="text-green-700">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Welcome content */}
        <div className="text-center lg:text-left space-y-6">
          <div className="flex justify-center lg:justify-start">
            <div className="bg-green-600 p-4 rounded-full">
              <Sprout className="w-12 h-12 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-green-800 mb-4">
              Welcome to AgriSenti
            </h1>
            <p className="text-lg text-green-700 mb-6">
              Your smart farming companion for better yields, disease detection, and market access in Nakuru County.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <Sprout className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-green-800">Smart Advisory</h3>
              <p className="text-sm text-green-600">AI-powered farming advice</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-green-800">Disease Detection</h3>
              <p className="text-sm text-green-600">Instant crop diagnosis</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-green-800">Market Access</h3>
              <p className="text-sm text-green-600">Connect with buyers</p>
            </div>
          </div>
        </div>

        {/* Right side - Auth forms */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-green-800">
              {activeTab === "login" ? "Welcome Back" : "Join AgriSenti"}
            </CardTitle>
            <CardDescription className="text-green-600">
              {activeTab === "login" 
                ? "Sign in to access your farming dashboard" 
                : "Create your account and start smart farming today"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="farmer@example.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type={showPassword.login ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(prev => ({ ...prev, login: !prev.login }))}
                      >
                        {showPassword.login ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    disabled={loading.login}
                  >
                    {loading.login ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In to Dashboard"
                    )}
                  </Button>

                  <div className="flex justify-between mt-2 text-sm">
                    <Link to="/forgot-password" className="text-green-600 hover:text-green-700">
                      Forgot password?
                    </Link>
                    <Link to="/resend-verification" className="text-green-600 hover:text-green-700">
                      Resend verification email
                    </Link>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Kimani"
                        value={signupData.fullName}
                        onChange={(e) => setSignupData(prev => ({ ...prev, fullName: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="farmer@example.com"
                        value={signupData.email}
                        onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Select onValueChange={(value) => setSignupData(prev => ({ ...prev, location: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nakuru-town">Nakuru Town</SelectItem>
                          <SelectItem value="njoro">Njoro</SelectItem>
                          <SelectItem value="naivasha">Naivasha</SelectItem>
                          <SelectItem value="molo">Molo</SelectItem>
                          <SelectItem value="gilgil">Gilgil</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="farmSize">Farm Size</Label>
                      <Select onValueChange={(value) => setSignupData(prev => ({ ...prev, farmSize: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small (1-5 acres)</SelectItem>
                          <SelectItem value="medium">Medium (5-20 acres)</SelectItem>
                          <SelectItem value="large">Large (20+ acres)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type={showPassword.signup ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={signupData.password}
                        onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(prev => ({ ...prev, signup: !prev.signup }))}
                      >
                        {showPassword.signup ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirm-password"
                        type={showPassword.confirm ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                      >
                        {showPassword.confirm ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    disabled={loading.signup || signupData.password !== signupData.confirmPassword}
                  >
                    {loading.signup ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account & Access Dashboard"
                    )}
                  </Button>
                  
                  <div className="mt-4 text-sm text-gray-600 bg-green-50 p-3 rounded-md border border-green-200">
                    <p>After signing up, you'll need to verify your email address. Please check your inbox (and spam folder) for a verification link.</p>
                  </div>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm">
              <Link to="/landing" className="text-green-600 hover:underline">
                ← Back to landing page
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
