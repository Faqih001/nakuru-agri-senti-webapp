
import { Sprout, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-green-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-green-600 p-2 rounded-lg">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">AgriSenti</h3>
                <p className="text-green-200 text-sm">Smart Farming Solutions</p>
              </div>
            </div>
            <p className="text-green-100 text-sm">
              Empowering Nakuru farmers with AI-driven crop advisory, disease detection, 
              and direct market access for better yields and profits.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-green-100 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/dashboard" className="block text-green-100 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link to="/about" className="block text-green-100 hover:text-white transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="block text-green-100 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Services</h4>
            <div className="space-y-2 text-green-100">
              <p>Crop Advisory</p>
              <p>Disease Detection</p>
              <p>Market Linkage</p>
              <p>Weather Updates</p>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-100">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">Nakuru County, Kenya</span>
              </div>
              <div className="flex items-center gap-2 text-green-100">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">+254 741 140 250</span>
              </div>
              <div className="flex items-center gap-2 text-green-100">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">fakiiahmad001@gmail.com</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-green-100 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-green-100 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-green-100 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-green-700 mt-8 pt-8 text-center">
          <p className="text-green-100 text-sm">
            © 2024 AgriSenti. All rights reserved. Empowering farmers for a sustainable future.
          </p>
        </div>
      </div>
    </footer>
  );
};
