import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Features from "./pages/Features";
import { Overview } from "@/components/Overview";
import { CropAssistant } from "@/components/CropAssistant";
import { DiseaseDetection } from "@/components/DiseaseDetection";
import { MarketDashboard } from "@/components/MarketDashboard";
import { WeatherDashboard } from "@/pages/WeatherDashboard";
import { Settings } from "@/pages/Settings";
import { ProfilePage } from "@/pages/ProfilePage";
import Help from "@/pages/Help";
import FeatureDetail from "./pages/FeatureDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import ResendVerification from "./pages/ResendVerification";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes with main layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/landing" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/signup" element={<Auth />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/resend-verification" element={<ResendVerification />} />
              <Route path="/features" element={<Features />} />
              <Route path="/features/:featureId" element={<FeatureDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Dashboard routes */}
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<Overview />} />
              <Route path="crop-assistant" element={<CropAssistant />} />
              <Route path="disease-detection" element={<DiseaseDetection />} />
              <Route path="weather" element={<WeatherDashboard />} />
              <Route path="market" element={<MarketDashboard />} />
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="help" element={<Help />} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
