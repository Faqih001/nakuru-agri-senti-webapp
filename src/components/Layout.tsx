import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Outlet } from "react-router-dom";
import ConfigurationAlert from "@/components/ConfigurationAlert";
import AIChatbot from "@/components/AIChatbot";

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Responsive Navigation */}
      <Navbar />
      
      {/* Main Content with proper spacing */}
      <main className="flex-1 relative">
        <div className="max-w-screen-2xl mx-auto">
          <Outlet />
        </div>
      </main>
      
      {/* Responsive Footer */}
      <Footer />
      
      {/* Development Configuration Alert */}
      {import.meta.env.DEV && <ConfigurationAlert />}
      
      {/* AI Chatbot - Responsive positioning */}
      <AIChatbot />
    </div>
  );
};
