import { ChevronRight, MapPin, Clock } from "lucide-react";

const ChevronRightIcon = () => <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-500" />;
const MapPinIcon = () => <MapPin className="w-4 h-4 text-gray-400" />;
const ClockIcon = () => <Clock className="w-4 h-4 text-gray-400" />;

const SalonCard = ({ salon, index, onSalonClick, onSalonHover }) => {
  const bannerImage =
      (salon.banner_images && salon.banner_images.length > 0 && salon.banner_images[0].image_link) ||
    "https://img.freepik.com/free-photo/interior-latino-hair-salon_23-2150555185.jpg?semt=ais_hybrid&w=740&q=80"; // default banner

  // Get today's day of week (0 = Sunday, 6 = Saturday)
  const today = new Date().getDay();
  const todayHours = salon.salon_opening_hours?.find(h => h.day_of_week === today);

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  let openingStatus = "Not Available Today";
  if (todayHours) {
    if (todayHours.is_open) {
      openingStatus = `${formatTime(todayHours.opening_time)} – ${formatTime(todayHours.closing_time)}`;
    } else {
      openingStatus = "Closed Today";
    }
  }

  return (
    <div
      onClick={() => onSalonClick(salon.salon_id)}
      onMouseEnter={() => onSalonHover && onSalonHover(salon)}
      className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-purple-200 transform hover:-translate-y-1"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Banner Image */}
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
              src={salon.salon_logo_link || "data:image/png;base64,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"}
              alt="Salon Logo"
              className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-xl object-cover border border-gray-200 group-hover:border-purple-300 transition-all shadow-sm"
            />
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

            {/* Rating & Open/Closed */}
            <div className="flex items-center gap-3 mb-3 text-sm">
              <div className="flex items-center gap-1 text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>{i < salon.average_rating ? "★" : "☆"}</span>
                ))}
                <span className="text-gray-600 ml-1">({salon.average_rating || 0})</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
              <span
                className={`font-medium flex items-center gap-1 ${
                  todayHours?.is_open ? "text-green-600" : "text-red-600"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    todayHours?.is_open ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                {todayHours?.is_open ? "Open" : "Closed"}
              </span>
            </div>

            {/* Address */}
            <p className="text-sm text-gray-600 flex items-center gap-2 truncate">
              <MapPinIcon />
              {salon.salon_address}
            </p>

            {/* Opening Time */}
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
              <ClockIcon />
              {openingStatus}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {todayHours?.is_open && (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                  Available Today
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalonCard;
