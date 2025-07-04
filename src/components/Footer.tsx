
import { Sprout, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-green-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Logo and Description */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="bg-green-600 p-1.5 sm:p-2 rounded-lg">
                <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg">AgriSenti</h3>
                <p className="text-green-200 text-xs sm:text-sm">Smart Farming Solutions</p>
              </div>
            </div>
            <p className="text-green-100 text-sm sm:text-base leading-relaxed">
              Empowering Nakuru farmers with AI-driven crop advisory, disease detection, 
              and direct market access for better yields and profits.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-semibold text-base sm:text-lg">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-green-100 hover:text-white transition-colors text-sm sm:text-base">
                Home
              </Link>
              <Link to="/dashboard" className="block text-green-100 hover:text-white transition-colors text-sm sm:text-base">
                Dashboard
              </Link>
              <Link to="/about" className="block text-green-100 hover:text-white transition-colors text-sm sm:text-base">
                About Us
              </Link>
              <Link to="/contact" className="block text-green-100 hover:text-white transition-colors text-sm sm:text-base">
                Contact
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-semibold text-base sm:text-lg">Services</h4>
            <div className="space-y-2 text-green-100">
              <p className="text-sm sm:text-base">Crop Advisory</p>
              <p className="text-sm sm:text-base">Disease Detection</p>
              <p className="text-sm sm:text-base">Market Linkage</p>
              <p className="text-sm sm:text-base">Weather Updates</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-semibold text-base sm:text-lg">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-green-100">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base">Nakuru County, Kenya</span>
              </div>
              <div className="flex items-center gap-2 text-green-100">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm sm:text-base">+254 741 140 250</span>
              </div>
              <div className="flex items-start gap-2 text-green-100">
                <Mail className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base break-all">fakiiahmad001@gmail.com</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-3 sm:gap-4 mt-4">
              <a href="#" className="text-green-100 hover:text-white transition-colors p-1">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-green-100 hover:text-white transition-colors p-1">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-green-100 hover:text-white transition-colors p-1">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-green-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-green-100 text-sm sm:text-base">
            © 2024 AgriSenti. All rights reserved. Empowering farmers for a sustainable future.
          </p>
        </div>
      </div>
    </footer>
  );
};
