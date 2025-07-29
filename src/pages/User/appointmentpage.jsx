import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import Navbar from "./components/Navbar";

const AppointmentPage = () => {
  const { salonId } = useParams();
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchSalonDetails = async () => {
      const res = await fetch(`http://localhost:3000/api/salons/by-id/${salonId}`);
      const data = await res.json();
      console.log(data);
      setSalon(data);
    };

    const fetchSalonServices = async () => {
      const res = await fetch(`http://localhost:3000/api/salons/${salonId}/services`);
      const result = await res.json();
      if (result.success) {
        setServices(result.data);
        setFilteredServices(result.data);
      }
    };

    fetchSalonDetails();
    fetchSalonServices();
  }, [salonId]);

  useEffect(() => {
    let filtered = [...services];

    if (activeCategory !== "All") {
      filtered = filtered.filter(service =>
        service.service_category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.service_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  }, [searchTerm, activeCategory, services]);

  const handleSelectService = (service) => {
    const already = selectedServices.find(s => s.service_id === service.service_id);
    if (already) {
      setSelectedServices(prev =>
        prev.filter(s => s.service_id !== service.service_id)
      );
    } else {
      setSelectedServices(prev => [...prev, service]);
    }
  };

  const totalPrice = selectedServices.reduce((sum, s) => sum + (s.price || 0), 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);

  const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 500,
  arrows: false,
  pauseOnHover: false,
  className: "rounded-lg overflow-hidden"
};


  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      <Navbar/>
    {salon && (
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 space-y-6">
        {/* Salon Header */}
        <div className="flex items-start gap-4">
          <img
            src={salon.salon_logo_link}
            alt="Salon Logo"
            className="w-16 h-16 rounded-full border object-cover"
          />
          <div>
            <h2 className="text-2xl font-semibold">{salon.salon_name}</h2>
            <p className="text-sm text-gray-600">{salon.salon_category || "Hair and Beauty"}</p>
            <div className="text-yellow-500 text-sm leading-none">
              {"⭐".repeat(salon.average_rating || 0)}
              {"☆".repeat(5 - (salon.average_rating || 0))}
            </div>
            <p className="text-xs text-gray-400 mt-1">📍 {salon.salon_address || "Colombo"}</p>
          </div>
        </div>

        {/* Banner Carousel */}
        <div className="overflow-hidden rounded-lg">
          {salon.banner_images?.length > 0 ? (
            <Slider {...sliderSettings}>
              {salon.banner_images.map((img, index) => (
                <div key={index}>
                  <img
                    src={img.image_link}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <img
              src="https://via.placeholder.com/1200x300"
              alt="Default Banner"
              className="w-full h-64 object-cover rounded-lg"
            />
          )}
        </div>

        {/* Filters */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {["Men", "Female", "Children", "Unisex"].map(tag => (
              <button
                key={tag}
                onClick={() => setActiveCategory(tag)}
                className={`px-4 py-1 text-sm rounded-full border ${
                  activeCategory === tag
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Services"
            className="w-full p-2 border rounded-md text-sm"
          />
        </div>

        {/* Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <label
              key={service.service_id}
              className="flex flex-col p-4 border rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedServices.some(s => s.service_id === service.service_id)}
                  onChange={() => handleSelectService(service)}
                  className="mt-1"
                />
                <div className="flex-grow">
                  <p className="font-medium">{service.service_name}</p>
                  <p className="text-sm text-gray-500">{service.service_description}</p>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-700 text-right">
                Rs {service.price}
              </div>
            </label>
          ))}
        </div>

        {/* Summary & Actions */}
        <div className="pt-6 space-y-4 border-t">
          <div className="flex justify-between text-sm text-gray-700">
            <span>⏱ Duration</span>
            <span>{totalDuration} minutes</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>💰 Total</span>
            <span>Rs {totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <button
              className="w-full py-2 text-sm bg-gray-100 text-gray-500 border rounded-md cursor-not-allowed"
              disabled
            >
              🧾 Pay at Venue
            </button>
            <button className="w-full py-2 text-sm bg-black text-white rounded-md hover:bg-gray-900 transition">
              Proceed
            </button>
          </div>
        </div>
      </div>
    )}
  </div>

  );
};

export default AppointmentPage;
