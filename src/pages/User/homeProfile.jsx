import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Added
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { parseWKBHexToLatLng } from "../../utils/wkbToLatLng";
import Header from "../../components/Header/Header";
import Navbar from "./components/Navbar";
import HeaderWithSearchBar from "./components/HeaderWithSearchBar";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const HomePage = () => {
  const [salons, setSalons] = useState([]);
  const [filteredSalons, setFilteredSalons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [center, setCenter] = useState([6.9271, 79.8612]); // default to Colombo
  const navigate = useNavigate(); // ✅ Added

  useEffect(() => {
    const fetchSalons = async () => {
      const res = await fetch("http://localhost:3000/api/salons");
      const data = await res.json();

      const parsed = data
        .filter((s) => s.location)
        .map((s) => ({
          ...s,
          coordinates: parseWKBHexToLatLng(s.location),
        }));

      if (parsed.length > 0) {
        setCenter([parsed[0].coordinates.lat, parsed[0].coordinates.lng]);
      }

      setSalons(parsed);
      setFilteredSalons(parsed);
    };

    fetchSalons();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = salons.filter(
      (salon) =>
        salon.salon_name.toLowerCase().includes(term) ||
        salon.salon_address.toLowerCase().includes(term)
    );
    setFilteredSalons(filtered);
  }, [searchTerm, salons]);

  const handleSalonClick = (salonId) => {
    navigate(`/appointment/${salonId}`);
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <Navbar />

      {/* Hero Section with Search */}
      <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
        <div className="max-w-4xl mx-auto text-center mb-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            Find Your Perfect Salon
          </h1>
          <p className="text-blue-100 text-lg">
            Discover top-rated salons near you
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <HeaderWithSearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden bg-white m-4 rounded-2xl shadow-xl">
        {/* Map Section */}
        <div className="h-1/2 lg:h-full lg:w-1/2 relative">
          <div className="absolute top-4 left-4 z-10 bg-white px-3 py-1 rounded-full shadow-md">
            <span className="text-sm font-medium text-gray-600">
              {filteredSalons.length} salon(s) found
            </span>
          </div>
          <MapContainer
            center={center}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            className="rounded-l-2xl lg:rounded-r-none lg:rounded-l-2xl"
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />

            {filteredSalons.map((salon) => (
              <Marker
                key={salon.salon_id}
                position={[salon.coordinates.lat, salon.coordinates.lng]}
                icon={defaultIcon}
              >
                <Popup>
                  <div
                    onClick={() => handleSalonClick(salon.salon_id)}
                    className="cursor-pointer text-white bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-lg shadow-lg min-w-48"
                  >
                    <b className="text-lg">{salon.salon_name}</b>
                    <br />
                    <p className="text-blue-100 text-sm mt-1">
                      {salon.salon_address}
                    </p>
                    <div className="mt-2 flex text-yellow-300 text-sm">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>
                          {i < salon.average_rating ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                    <span className="text-yellow-300 underline text-sm mt-2 block">
                      Click to book →
                    </span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Salon List */}
        <div className="h-1/2 lg:h-full lg:w-1/2 overflow-y-auto p-6 bg-gray-50 space-y-4 rounded-r-2xl lg:rounded-l-none">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Available Salons
            </h2>
            <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
              {filteredSalons.length} results
            </span>
          </div>

          {filteredSalons.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No salons found
              </h3>
              <p className="text-gray-500">Try adjusting your search terms</p>
            </div>
          ) : (
            filteredSalons.map((salon) => (
              <div
                key={salon.salon_id}
                onClick={() => handleSalonClick(salon.salon_id)}
                className="group flex items-center gap-4 bg-white shadow-sm rounded-xl p-5 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border border-gray-100 hover:border-blue-200"
              >
                <div className="relative">
                  <img
                    src={salon.salon_logo_link}
                    alt="Salon Logo"
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shadow-sm group-hover:border-blue-300 transition-colors"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {salon.salon_name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex text-yellow-400 text-sm">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>
                          {i < salon.average_rating ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({salon.average_rating || 0}/5)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <p className="text-sm text-green-600 font-medium">Open</p>
                    <span className="text-sm text-gray-500">
                      • 8:00 am to 10:00 pm
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {salon.salon_address}
                  </p>
                </div>
                <div className="text-blue-600 group-hover:text-blue-700 transition-colors">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
