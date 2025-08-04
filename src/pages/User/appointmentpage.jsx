import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom" 
import axios from "axios"
import { Star, MapPin, Clock, ReceiptText } from "lucide-react" 

import Header from "../../components/Header/Header"
import SalonImageGallery from "./components/SalonImageGallery"

const AppointmentPage = () => {
  const { salonId } = useParams()
  const navigate = useNavigate()
  const [salon, setSalon] = useState(null)
  const [services, setServices] = useState([])
  const [filteredServices, setFilteredServices] = useState([])
  const [selectedServices, setSelectedServices] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  useEffect(() => {
    const fetchSalonDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/salons/by-id/${salonId}`)
        setSalon(res.data)
      } catch (error) {
        console.error("Error fetching salon details:", error)
        // Handle error, e.g., navigate to an error page or show a message
      }
    }

    const fetchSalonServices = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/salons/${salonId}/services`)
        if (res.data.success) {
          setServices(res.data.data)
          setFilteredServices(res.data.data)
        }
      } catch (error) {
        console.error("Error fetching salon services:", error)
        // Handle error
      }
    }

    fetchSalonDetails()
    fetchSalonServices()
  }, [salonId])

  useEffect(() => {
    let filtered = [...services]
    if (activeCategory !== "All") {
      filtered = filtered.filter((service) => service.service_category.toLowerCase() === activeCategory.toLowerCase())
    }
    if (searchTerm) {
      filtered = filtered.filter((service) => service.service_name.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    setFilteredServices(filtered)
  }, [searchTerm, activeCategory, services])

  const handleSelectService = (service) => {
    const already = selectedServices.find((s) => s.service_id === service.service_id)
    if (already) {
      setSelectedServices((prev) => prev.filter((s) => s.service_id !== service.service_id))
    } else {
      setSelectedServices((prev) => [...prev, service])
    }
  }

  const handleProceed = () => {
    if (selectedServices.length === 0) return
    navigate("/schedule", {
      state: {
        salonId,
        salon_logo_link: salon?.salon_logo_link,
        salon_name: salon?.salon_name,
        salon_average_rating: salon?.average_rating,
        salon_address: salon?.salon_address,
        serviceIds: selectedServices.map((s) => s.service_id),
        serviceNames: selectedServices.map((s) => s.service_name),
        serviceDurations: selectedServices.map((s) => s.duration_minutes),
        servicePrices: selectedServices.map((s) => s.price),
      },
    })
  }

  const totalPrice = selectedServices.reduce((sum, s) => sum + (s.price || 0), 0)
  const totalDuration = selectedServices.reduce((sum, s) => sum + (s.duration_minutes || 0), 0)

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 to-white flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
        {salon && (
          <div className="w-full max-w-7xl space-y-10">
            {/* Salon Header Card */}
            <div className="flex flex-col md:flex-row items-center gap-8 bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-purple-100 transform transition-all duration-300 hover:scale-[1.01]">
              <div className="relative">
                <img
                  src={salon.salon_logo_link || "/placeholder.svg"}
                  alt="Salon Logo"
                  className="w-24 h-24 rounded-full object-cover border-4 border-purple-200 shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-3 border-white rounded-full"></div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">{salon.salon_name}</h2>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                  <div className="flex text-yellow-500 text-xl">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${i < (salon.average_rating || 0) ? "fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-base text-gray-600">({salon.average_rating || 0}/5)</span>
                </div>
                <p className="text-base text-gray-600 mt-2">{salon.salon_category || "Hair and Beauty"}</p>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-gray-700">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  <span className="text-base">{salon.salon_address || "Colombo"}</span>
                </div>
              </div>
            </div>

            {/* Salon Image Gallery */}
            <div className="w-full h-auto md:h-[36rem] rounded-3xl overflow-hidden shadow-xl">
              <SalonImageGallery banner_images={salon?.banner_images || []} />
            </div>

            {/* Filters */}
            <div className="space-y-6">
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {["All", "Men", "Female", "Children", "Unisex"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveCategory(tag)}
                    className={`px-6 py-2 text-base rounded-full border-2 shadow-md transition-all duration-300
                      ${
                        activeCategory === tag
                          ? "bg-purple-600 text-white border-purple-600 scale-105 font-semibold"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-purple-100 hover:text-purple-800"
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Services..."
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-lg shadow-inner focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-200"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              </div>
            </div>

            {/* Services and Summary Side by Side */}
            <div className="flex flex-col md:flex-row gap-10 w-full">
              <div className="flex-1 grid grid-cols-1 gap-8">
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <label
                      key={service.service_id}
                      className="flex flex-col p-6 border border-gray-200 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer relative group"
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={selectedServices.some((s) => s.service_id === service.service_id)}
                          onChange={() => handleSelectService(service)}
                          className="mt-1 accent-purple-600 scale-125 transform transition-transform duration-200"
                        />
                        <div className="flex-grow">
                          <p className="font-bold text-xl text-gray-900">{service.service_name}</p>
                          <p className="text-sm text-gray-600 mt-1">{service.service_description}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center text-base text-gray-700">
                        <span className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-purple-400" />
                          {service.duration_minutes || 0} min
                        </span>
                        <span className="font-extrabold text-xl text-purple-700">Rs {service.price}</span>
                      </div>
                      <span className="absolute top-4 right-4 bg-purple-600 text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Select
                      </span>
                    </label>
                  ))
                ) : (
                  <p className="text-center text-gray-500 text-lg py-10">No services found matching your criteria.</p>
                )}
              </div>

              {/* Summary Panel */}
              <div className="w-full md:w-96 flex-shrink-0">
                <div className="sticky top-28 bg-white rounded-3xl shadow-2xl border border-purple-100 p-8 space-y-6">
                  <h3 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-4">Summary</h3>
                  {/* Selected services list */}
                  <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                    {selectedServices.map((service) => (
                      <div
                        key={service.service_id}
                        className="flex justify-between text-base text-gray-700 border-b border-gray-100 pb-2"
                      >
                        <div>
                          <p className="font-medium">{service.service_name}</p>
                          <p className="text-sm text-gray-500">{service.duration_minutes} min</p>
                        </div>
                        <span className="font-semibold">Rs {service.price}</span>
                      </div>
                    ))}
                    {selectedServices.length === 0 && (
                      <p className="text-base text-gray-500 text-center py-4">No services selected yet.</p>
                    )}
                  </div>

                  <div className="flex justify-between text-lg text-gray-800 pt-4 border-t border-gray-200">
                    <span>Duration</span>
                    <span className="font-medium">{totalDuration} minutes</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-3xl">
                    <span>Total</span>
                    <span className="text-purple-800">Rs {totalPrice.toLocaleString()}</span>
                  </div>

                  <div className="flex flex-col gap-4 pt-2">
                    <button
                      className="w-full py-4 text-lg bg-gray-100 text-gray-600 border border-gray-200 rounded-xl cursor-not-allowed shadow-md flex items-center justify-center gap-2"
                      disabled
                    >
                      <ReceiptText className="w-6 h-6" />
                      <span>Pay at Venue</span>
                    </button>
                    <button
                      onClick={handleProceed}
                      disabled={selectedServices.length === 0}
                      className="w-full py-4 text-lg bg-purple-600 text-white rounded-xl shadow-lg hover:bg-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Proceed
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AppointmentPage
