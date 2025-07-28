import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

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
    className: "rounded-lg overflow-hidden"
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {salon && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Banner Images Carousel */}
          <div className="col-span-1">
            {salon.banner_images?.length > 0 ? (
              <Slider {...sliderSettings}>
                {salon.banner_images.map((img, index) => (
                  <div key={index}>
                    <img
                      src={img.image_link}
                      alt={`Banner ${index + 1}`}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <img
                src="https://via.placeholder.com/400x200"
                alt="Default Banner"
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
          </div>

          {/* Salon Info */}
          <div className="col-span-2 flex flex-col justify-between">
            <div className="flex items-start gap-4">
              <img
                src={salon.salon_logo_link}
                alt="Salon Logo"
                className="w-20 h-20 object-cover rounded-full"
              />
              <div>
                <h1 className="text-3xl font-bold">{salon.salon_name}</h1>
                <p className="text-gray-600">{salon.salon_category || "Hair and Beauty"}</p>
                <p className="text-yellow-500 text-sm">
                  {"⭐".repeat(salon.average_rating || 0)}
                  {"☆".repeat(5 - (salon.average_rating || 0))}
                </p>
                <p className="text-sm text-gray-500">📍 {salon.salon_address || "Colombo"}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        {["All", "Male", "Female", "Children", "Unisex"].map(tag => (
          <button
            key={tag}
            onClick={() => setActiveCategory(tag)}
            className={`px-4 py-2 text-sm border rounded-full ${
              activeCategory === tag ? "bg-black text-white" : "bg-gray-100"
            }`}
          >
            {tag}
          </button>
        ))}

        <input
          type="text"
          placeholder="Search Services..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border rounded-md min-w-[200px]"
        />
      </div>

      {/* Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {filteredServices.map(service => (
          <label
            key={service.service_id}
            className="flex items-start justify-between border p-4 rounded-md cursor-pointer hover:bg-gray-50"
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={selectedServices.some(s => s.service_id === service.service_id)}
                onChange={() => handleSelectService(service)}
                className="mt-1"
              />
              <div>
                <p className="font-medium text-lg">{service.service_name}</p>
                <p className="text-sm text-gray-500">{service.service_description}</p>
              </div>
            </div>
            <div className="text-right text-sm text-gray-700 whitespace-nowrap">
              {!service.show_price && `Rs ${service.price}`}
            </div>
          </label>
        ))}
      </div>

      {/* Summary + Action */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center text-lg mb-2">
          <span>⏱ Duration</span>
          <span>{totalDuration} minutes</span>
        </div>
        <div className="flex justify-between items-center text-lg mb-4 font-semibold">
          <span>💰 Total</span>
          <span>Rs {totalPrice.toLocaleString()}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <button
            className="w-full py-3 border rounded-md bg-gray-100 text-black flex items-center justify-center gap-2"
            disabled
          >
            🧾 Pay at Venue
          </button>
          <button className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-900 transition">
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
