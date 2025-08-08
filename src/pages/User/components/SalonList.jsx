import { useRef } from "react";
import SalonCard from "./SalonCard";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SalonList = ({ filteredSalons, isLoading, onSalonClick, onSalonHover }) => {
  const scrollRef = useRef();

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-black via-gray-800 to-red-600 bg-clip-text text-transparent">
            Available Salons
          </h2>
          <p className="hidden sm:block text-gray-700 text-lg max-w-2xl mx-auto">
            Choose from our curated selection of top-rated salons near you.
          </p>

          <div className="mt-4 border border-black rounded-full px-5 py-2 inline-block bg-white">
            <span className="text-sm font-semibold text-black">
              {filteredSalons.length} results
            </span>
          </div>
        </div>

        {/* Salon Cards Container */}
        <div className="relative">
          {/* Left Scroll Button (Desktop Only) */}
          <button
            onClick={scrollLeft}
            className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-black rounded-full p-3 shadow-md hover:bg-gray-100 transition"
          >
            <ChevronLeft className="w-5 h-5 text-black" />
          </button>

          {/* Salon Card List */}
          <div
            ref={scrollRef}
            className="flex flex-col md:flex-row md:overflow-x-scroll gap-6 md:gap-6 md:px-12 py-4 no-scrollbar scroll-smooth"
          >
            {isLoading ? (
              <LoadingSpinner />
            ) : filteredSalons.length === 0 ? (
              <EmptyState />
            ) : (
              filteredSalons.map((salon, index) => (
                <div
                  key={salon.salon_id}
                  className="flex-shrink-0 w-full md:w-80 max-w-[20rem] mx-auto transition-transform duration-300 hover:scale-100 md:hover:scale-[1.02]"
                >
                  <SalonCard
                    salon={salon}
                    index={index}
                    onSalonClick={onSalonClick}
                    onSalonHover={onSalonHover}
                  />
                </div>
              ))
            )}
          </div>

          {/* Right Scroll Button (Desktop Only) */}
          <button
            onClick={scrollRight}
            className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-black rounded-full p-3 shadow-md hover:bg-gray-100 transition"
          >
            <ChevronRight className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SalonList;