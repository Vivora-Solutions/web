import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import axios from "axios"; 

import Header from "../../components/Header/Header";


const AppointmentPage = () => {
  const { salonId } = useParams();
  const navigate = useNavigate();

  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchSalonDetails = async () => {
      const res = await axios.get(`http://localhost:3000/api/salons/by-id/${salonId}`);
      setSalon(res.data);
    };

    const fetchSalonServices = async () => {
      const res = await axios.get(`http://localhost:3000/api/salons/${salonId}/services`);
      if (res.data.success) {
        setServices(res.data.data);
        setFilteredServices(res.data.data);
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

  const handleProceed = () => {
    if (selectedServices.length === 0) return;

    console.log("Selected Prices: ", selectedServices.map(s=> s.price))

    navigate("/schedule", {
      state: {
        salonId,
        salon_logo_link: salon?.salon_logo_link,
        salon_name: salon?.salon_name,
        salon_average_rating: salon?.average_rating,
        salon_address: salon?.salon_address,
        serviceIds: selectedServices.map(s => s.service_id),
        serviceNames: selectedServices.map(s => s.service_name),
        serviceDurations: selectedServices.map(s => s.duration_minutes),
        servicePrices: selectedServices.map(s => s.price)
      }
    });
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
    autoplaySpeed: 3500,
    arrows: false,
    pauseOnHover: false,
    className: "rounded-2xl overflow-hidden"
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col items-center py-8 px-2 md:px-8">
        {salon && (
          <div className="w-full max-w-none space-y-8">
            {/* Salon Header Card */}
            <div className="flex flex-col md:flex-row items-center gap-6 bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
              <div className="relative">
                <img
                  src={salon.salon_logo_link}
                  alt="Salon Logo"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{salon.salon_name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex text-yellow-400 text-lg">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>
                        {i < (salon.average_rating || 0) ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({salon.average_rating || 0}/5)
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{salon.salon_category || "Hair and Beauty"}</p>
                <div className="flex items-center gap-1 mt-1">
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
                  <span className="text-gray-500">{salon.salon_address || "Colombo"}</span>
                </div>
              </div>
            </div>

            {/* Banner Images: Main slider left, vertical thumbnails right */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 flex flex-col md:flex-row gap-4 w-full">
              {/* Main Slider */}
              <div className="w-full md:w-1/2 min-w-0 flex items-center">
                {salon.banner_images?.length > 0 ? (
                  <Slider {...sliderSettings}>
                    {salon.banner_images.map((img, index) => (
                      <div key={index}>
                        <img
                          src={img.image_link}
                          alt={`Banner ${index + 1}`}
                          className="w-full h-72 md:h-[36rem] lg:h-[40rem] object-cover rounded-2xl"
                        />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <img
                    src="https://via.placeholder.com/1200x300"
                    alt="Default Banner"
                    className="w-full h-72 md:h-[36rem] lg:h-[40rem] object-cover rounded-2xl"
                  />
                )}
              </div>
              {/* Vertical Thumbnails */}
              <div className="w-full md:w-1/2 flex flex-col justify-center"
                   style={{ height: '18rem', maxHeight: '36rem' }}>
                {salon.banner_images && salon.banner_images.length > 1
                  ? salon.banner_images.map((img, index) => (
                      <img
                        key={index}
                        src={img.image_link}
                        alt={`Banner Thumb ${index + 1}`}
                        className="w-full flex-1 object-cover rounded-xl border border-gray-200 shadow mb-2 last:mb-0"
                        style={{
                          objectPosition: "center",
                          height: `calc(100% / ${salon.banner_images.length})`,
                          minHeight: "0"
                        }}
                      />
                    ))
                  : Array.from({ length: 3 }).map((_, idx) => (
                      <img
                        key={idx}
                        src={salon.banner_images?.[0]?.image_link || "https://via.placeholder.com/1200x300"}
                        alt={`Banner Thumb ${idx + 1}`}
                        className="w-full flex-1 object-cover rounded-xl border border-gray-200 shadow mb-2 last:mb-0"
                        style={{
                          objectPosition: "center",
                          height: "calc(100% / 3)",
                          minHeight: "0"
                        }}
                      />
                    ))
                }
              </div>
            </div>

            {/* Filters */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {["All", "Men", "Female", "Children", "Unisex"].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setActiveCategory(tag)}
                    className={`px-5 py-2 text-sm rounded-full border shadow-sm transition
                      ${activeCategory === tag
                        ? "bg-indigo-600 text-white border-indigo-600 scale-105"
                        : "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
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
                placeholder="🔍 Search Services"
                className="w-full p-3 border border-gray-200 rounded-lg text-base shadow-sm focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            {/* Services and Summary Side by Side */}
            <div className="flex flex-col md:flex-row gap-8 w-full">
              {/* Services List */}
              <div className="flex-1">
                <div className="grid grid-cols-1 gap-6">
                  {filteredServices.map((service) => (
                    <label
                      key={service.service_id}
                      className="flex flex-col p-5 border rounded-2xl bg-white shadow-md hover:shadow-xl transition hover:-translate-y-1 cursor-pointer relative group"
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedServices.some(s => s.service_id === service.service_id)}
                          onChange={() => handleSelectService(service)}
                          className="mt-1 accent-indigo-600 scale-125"
                        />
                        <div className="flex-grow">
                          <p className="font-semibold text-lg text-gray-900">{service.service_name}</p>
                          <p className="text-sm text-gray-500">{service.service_description}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-between items-center text-sm text-gray-700">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {service.duration_minutes || 0} min
                        </span>
                        <span className="font-bold text-indigo-700">Rs {service.price}</span>
                      </div>
                      <span className="absolute top-3 right-3 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition">
                        Select
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Summary Panel */}
              <div className="w-full md:w-80 flex-shrink-0">
                <div className="sticky top-28 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Summary</h3>
                  <div className="flex justify-between text-base text-gray-700">
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19a7 7 0 100-14 7 7 0 000 14z" />
                      </svg>
                      Duration
                    </span>
                    <span className="font-medium">{totalDuration} minutes</span>
                  </div>
                  <div className="flex justify-between items-center font-semibold text-2xl">
                    <span className="flex items-center gap-2">
                      <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 7v7" />
                      </svg>
                      Total
                    </span>
                    <span>Rs {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col gap-3 pt-2">
                    <button
                      className="w-full py-3 text-base bg-gray-100 text-gray-500 border rounded-lg cursor-not-allowed shadow"
                      disabled
                    >
                      🧾 Pay at Venue
                    </button>
                    <button
                      onClick={handleProceed}
                      disabled={selectedServices.length === 0}
                      className="w-full py-3 text-base bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Proceed
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* End Services and Summary Side by Side */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentPage;