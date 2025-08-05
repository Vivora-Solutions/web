import { ChevronRight, MapPin, Clock } from "lucide-react";

const ChevronRightIcon = () => <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-500" />;
const MapPinIcon = () => <MapPin className="w-4 h-4 text-gray-400" />;
const ClockIcon = () => <Clock className="w-4 h-4 text-gray-400" />;

const SalonCard = ({ salon, index, onSalonClick, onSalonHover }) => {
  const bannerImage =
    salon.banner_image ||
    (salon.banner_images && salon.banner_images.length > 0 && salon.banner_images[0].image_link);

  return (
    <div
      onClick={() => onSalonClick(salon.salon_id)}
      onMouseEnter={() => onSalonHover && onSalonHover(salon)}
      className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-purple-200 transform hover:-translate-y-1"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Banner Image (if exists) */}
      {bannerImage && (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={bannerImage}
            alt="Salon Banner"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4 md:p-5 lg:p-6">
        <div className="relative flex items-start gap-4">
          {/* Salon Logo */}
          <div className="relative flex-shrink-0">
            <img
              src={salon.salon_logo_link || "/placeholder.svg"}
              alt="Salon Logo"
              className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-xl object-cover border border-gray-200 group-hover:border-purple-300 transition-all shadow-sm"
            />
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-base md:text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition-colors truncate">
                {salon.salon_name}
              </h3>
              <div className="ml-2">
                <ChevronRightIcon />
              </div>
            </div>

            <div className="flex items-center gap-3 mb-3 text-sm">
              <div className="flex items-center gap-1 text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>{i < salon.average_rating ? "★" : "☆"}</span>
                ))}
                <span className="text-gray-600 ml-1">({salon.average_rating || 0})</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="text-green-600 font-medium flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Open
              </span>
            </div>

            <p className="text-sm text-gray-600 flex items-center gap-2 truncate">
              <MapPinIcon />
              {salon.salon_address}
            </p>

            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
              <ClockIcon />
              8:00 AM - 10:00 PM
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                Available Today
              </span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                Quick Booking
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalonCard;
