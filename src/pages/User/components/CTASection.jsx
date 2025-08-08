import { Calendar, Phone } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-r from-black via-gray-900 to-red-900 text-white">
      <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Heading with responsive sizing */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 leading-snug sm:leading-tight">
          Ready to Transform Your Look?
        </h2>
        
        {/* Subheading with responsive sizing */}
        <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 text-gray-200 max-w-2xl mx-auto">
          Join thousands of satisfied customers and book your appointment today.
        </p>
        
        {/* Button container with responsive layout */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 justify-center">
          {/* Book Appointment Button */}
          <button 
            className="px-5 py-3 sm:px-6 sm:py-3 md:px-7 bg-white text-black font-medium rounded-full border border-black hover:bg-gray-100 transition-colors flex items-center justify-center shadow-md w-full sm:w-auto"
          >
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Book Appointment
          </button>
          
          {/* Call Us Button */}
          <button 
            className="px-5 py-3 sm:px-6 sm:py-3 md:px-7 bg-red-600 text-white font-medium rounded-full hover:bg-white hover:text-red-600 border border-white transition-colors flex items-center justify-center shadow-md w-full sm:w-auto"
          >
            <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Call Us Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;