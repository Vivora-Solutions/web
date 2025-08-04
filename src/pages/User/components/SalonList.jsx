import { useRef } from "react";
import SalonCard from "./SalonCard";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SalonList = ({ filteredSalons, isLoading, onSalonClick, onSalonHover }) => {
  const scrollRef = useRef();

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Available Salons
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose from our curated selection of top-rated salons near you.
          </p>
          <div className="mt-4 bg-gradient-to-r from-purple-100 to-pink-100 inline-block rounded-full px-5 py-2">
            <span className="text-sm font-semibold text-purple-700">
              {filteredSalons.length} results
            </span>
          </div>
        </div>

        {/* Scrollable Salon Cards */}
        <div className="relative">
          {/* Left Scroll Button */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5 text-purple-600" />
          </button>

          {/* Horizontal Scroll Container */}
          <div
            ref={scrollRef}
            className="flex overflow-x-scroll gap-6 px-12 py-4 no-scrollbar scroll-smooth"
          >
            {isLoading ? (
              <LoadingSpinner />
            ) : filteredSalons.length === 0 ? (
              <EmptyState />
            ) : (
              filteredSalons.map((salon, index) => (
                <div
                  key={salon.salon_id}
                  className="flex-shrink-0 w-80 max-w-[20rem] transition-transform duration-300 hover:scale-[1.02]"
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

          {/* Right Scroll Button */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100"
          >
            <ChevronRight className="w-5 h-5 text-purple-600" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SalonList;
