
const CTASection = () => {
  return (
    <section className="py-1 md:py-10 bg-gradient-to-r from-black via-gray-900 to-red-900 text-white">
      <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Heading with responsive sizing */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 leading-snug sm:leading-tight">
          Ready to Transform Your Look?
        </h2>
        
        {/* Subheading with responsive sizing */}
        <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 text-gray-200 max-w-2xl mx-auto">
          Join thousands of satisfied customers and book your appointment today.
        </p>
      </div>
    </section>
  );
};

export default CTASection;