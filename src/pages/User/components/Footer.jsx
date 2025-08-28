import { Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Responsive Grid: 1 col on mobile, 2 on sm, 4 on md+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Logo Section */}
          <div>
            <h3 className="flex items-center space-x-2 text-lg font-bold mb-4">
              <img 
                src="/logo.png" 
                alt="Vivora Logo" 
                className="h-8 w-8 object-contain"
              />
              <span className="text-2xl font-bold">Vivora</span>
            </h3>
            <p className="text-gray-400 text-sm">
              Your trusted partner for salon services and beauty experiences.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white transition-colors">Find Salons</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/salon-register" className="hover:text-white transition-colors">Register as a Salon</a></li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms-and-conditions-for-clients" className="hover:text-white transition-colors">Terms & Conditions (Clients)</a></li>
              <li><a href="/terms-and-conditions-for-salons" className="hover:text-white transition-colors">Terms & Conditions (Salons)</a></li>
            </ul>
          </div>

          {/* Contact Info Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-start">
                <Phone className="h-4 w-4 mr-2 mt-1" />
                <div className="flex flex-col space-y-1">
                  <span>+94 71 572 9105</span>
                  <span>+94 76 678 7578</span>
                  <span>+94 70 244 3978</span>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>No 251/A, Molpe Road, Katubedda, Moratuwa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 Vivora. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
