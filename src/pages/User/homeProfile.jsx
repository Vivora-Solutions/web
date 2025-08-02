import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { parseWKBHexToLatLng } from "../../utils/wkbToLatLng"
import Header from "../../components/Header/Header"
import HeroSection from "./components/HeroSection"
import MapSection from "./components/MapSection"
import SalonList from "./components/SalonList"
import ReviewSection from "./components/ReviewSection"
import Footer from "./components/Footer"
import axios from "axios"

const HomePage = () => {
  const [salons, setSalons] = useState([])
  const [filteredSalons, setFilteredSalons] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSalon, setSelectedSalon] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [center, setCenter] = useState([7.8731, 80.7718])
  const [zoom, setZoom] = useState(7)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        setIsLoading(true)
        const res = await axios.get("http://localhost:3000/api/salons")
        const data = res.data
        const parsed = data
          .filter((s) => s.location)
          .map((s) => ({
            ...s,
            coordinates: parseWKBHexToLatLng(s.location),
          }))
        setSalons(parsed)
        setFilteredSalons(parsed)
      } catch (err) {
        console.error("Failed to fetch salons:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSalons()
  }, [])

  useEffect(() => {
    const term = searchTerm.toLowerCase()
    const filtered = salons.filter(
      (salon) => salon.salon_name.toLowerCase().includes(term) || salon.salon_address.toLowerCase().includes(term),
    )
    setFilteredSalons(filtered)
  }, [searchTerm, salons])

  const handleSalonClick = (salonId) => {
    navigate(`/appointment/${salonId}`)
  }

  const handleSalonHover = (salon) => {
    setSelectedSalon(salon)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <Header />

      <HeroSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} salonCount={filteredSalons.length} />

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            <MapSection center={center} zoom={zoom} filteredSalons={filteredSalons} onSalonClick={handleSalonClick} />

            <SalonList
              filteredSalons={filteredSalons}
              isLoading={isLoading}
              onSalonClick={handleSalonClick}
              onSalonHover={handleSalonHover}
            />
          </div>
        </div>
      </div>

      <ReviewSection />
      <Footer />
    </div>
  )
}

export default HomePage
