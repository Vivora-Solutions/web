import { Calendar, Phone } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Look?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers and book your appointment today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-white text-pink-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center">
              <Calendar className="h-5 w-5 mr-2" />
              Book Appointment
            </button>
            <button className="px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-pink-600 transition-colors flex items-center justify-center">
              <Phone className="h-5 w-5 mr-2" />
              Call Us Now
            </button>
          </div>
        </div>
      </section>
  );
};

export default CTASection;
