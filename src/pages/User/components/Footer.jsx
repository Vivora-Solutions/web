import { Sparkles, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Desktop Version */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="h-8 w-8 text-pink-400" />
              <span className="text-2xl font-bold">Vivora</span>
            </div>
            <p className="text-gray-400">Your trusted partner for all beauty and wellness needs.</p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Find Salons</a></li>
              {/* <li><a href="#" className="hover:text-white transition-colors">About Us</a></li> */}
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
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

        {/* Mobile Version */}
        <div className="block md:hidden text-center space-y-4">
          <div className="flex justify-center items-center space-x-2">
            <Sparkles className="h-6 w-6 text-pink-400" />
            <span className="text-xl font-bold">Vivora</span>
          </div>
          <ul className="flex justify-center space-x-6 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-white">Find Salons</a></li>
            <li><a href="#" className="hover:text-white">Services</a></li>
          </ul>
          <div className="flex justify-center items-center text-gray-400 text-sm space-x-4">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-1" />
              <span>+94 77 123 4567</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>Colombo</span>
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
