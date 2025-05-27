import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Outlet } from "react-router-dom";
import ConfigurationAlert from "@/components/ConfigurationAlert";
import AIChatbot from "@/components/AIChatbot";

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {/* Only show the configuration alert in development mode */}
      {import.meta.env.DEV && <ConfigurationAlert />}
      <AIChatbot />
    </div>
  );
};
