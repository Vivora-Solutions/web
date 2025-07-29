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
        .filter(s => s.location)
        .map(s => ({
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
      salon =>
        salon.salon_name.toLowerCase().includes(term) ||
        salon.salon_address.toLowerCase().includes(term)
    );
    setFilteredSalons(filtered);
  }, [searchTerm, salons]);

  const handleSalonClick = (salonId) => {
    navigate(`/appointment/${salonId}`);
  };

  return (
  <div className="w-full h-screen flex flex-col bg-gray-50">
    <Header />
    <Navbar />

    {/* Search Bar Section */}
    <div className="px-4 py-3 bg-white shadow-md z-10">
      <HeaderWithSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    </div>

    {/* Main Content */}
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
      
      {/* Map Section */}
      <div className="h-1/2 lg:h-full lg:w-1/2">
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
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
                  className="cursor-pointer text-white bg-black p-2 rounded"
                >
                  <b>{salon.salon_name}</b><br />
                  {salon.salon_address}<br />
                  <span className="text-blue-400 underline">View Salon</span>
                </div>
              </Popup>

            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Salon List */}
      <div className="h-1/2 lg:h-full lg:w-1/2 overflow-y-auto p-6 bg-white space-y-6">
        {filteredSalons.map((salon) => (
          <div
            key={salon.salon_id}
            onClick={() => handleSalonClick(salon.salon_id)}
            className="flex items-center gap-4 bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer hover:-translate-y-0.5"
          >
            <img
              src={salon.salon_logo_link}
              alt="Salon Logo"
              className="w-16 h-16 rounded-full object-cover border border-gray-200 shadow-sm"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">{salon.salon_name}</h3>
              <p className="text-sm text-gray-500">Open • 8:00 am to 10:00 pm</p>
              <p className="text-sm text-gray-600">{salon.salon_address}</p>
              <div className="mt-1 flex text-yellow-400 text-lg">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>
                    {i < salon.average_rating ? "★" : "☆"}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

};

export default HomePage;
