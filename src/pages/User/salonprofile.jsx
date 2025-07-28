import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Added
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { parseWKBHexToLatLng } from "../../utils/wkbToLatLng";
import Header from "../../components/Header/Header";
import Navbar from "./components/Header/Navbar";
import HeaderWithSearchBar from "./components/Header/HeaderWithSearchBar";
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
    <div className="w-full h-screen flex flex-col">
      <Header />
      <Navbar />
      <HeaderWithSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="h-1/2">
        <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {filteredSalons.map(salon => (
            <Marker
              key={salon.salon_id}
              position={[salon.coordinates.lat, salon.coordinates.lng]}
              icon={defaultIcon}
            >
              <Popup>
                <div
                  onClick={() => handleSalonClick(salon.salon_id)}
                  className="cursor-pointer"
                >
                  <b>{salon.salon_name}</b><br />
                  {salon.salon_address}<br />
                  <span className="text-blue-600 underline">View Salon</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Scrollable list */}
      <div className="h-1/2 overflow-y-auto p-4 bg-white">
        {filteredSalons.map(salon => (
          <div
            key={salon.salon_id}
            onClick={() => handleSalonClick(salon.salon_id)} // ✅ Navigate on click
            className="mb-4 p-3 border rounded-lg flex items-center cursor-pointer hover:bg-gray-100 transition"
          >
            <img
              src={salon.salon_logo_link}
              alt="logo"
              className="w-16 h-16 object-cover rounded-full mr-4"
            />
            <div>
              <h3 className="text-lg font-semibold">{salon.salon_name}</h3>
              <p className="text-sm text-gray-500">Open • 8.00 am to 10.00 pm</p>
              <p className="text-sm text-gray-600">{salon.salon_address}</p>
              <div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>{i < salon.average_rating ? "⭐" : "☆"}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
